import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { LayoutAnimation, Pressable, Text } from 'react-native'
import { makeGesture } from '../../test/gesture'
import { type ToastOptions, ToastProvider, useToast } from './toast'

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

// Dois passos: o timer dispara o dismiss e só depois do render nasce a animação de saída.
const settle = (ms = 500) => {
  act(() => jest.advanceTimersByTime(ms))
  act(() => jest.advanceTimersByTime(500))
}

function Fire({ options, onId }: { options: ToastOptions; onId?: (id: number) => void }) {
  const { toast, dismiss } = useToast()
  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          const id = toast(options)
          onId?.(id)
        }}
      >
        <Text>disparar</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => dismiss(0)}>
        <Text>fechar-0</Text>
      </Pressable>
    </>
  )
}

function setup(options: ToastOptions, onId?: (id: number) => void) {
  render(
    <ToastProvider>
      <Fire options={options} onId={onId} />
    </ToastProvider>,
  )
  fireEvent.press(screen.getByText('disparar'))
}

describe('Toast', () => {
  it('lança erro sem provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Fire options={{ description: 'x' }} />)).toThrow(/ToastProvider/)
  })

  it('mostra título e descrição', () => {
    setup({ title: 'Salvo', description: 'Alterações salvas' })
    expect(screen.getByText('Salvo')).toBeTruthy()
    expect(screen.getByText('Alterações salvas')).toBeTruthy()
  })

  it('fecha sozinho após a duração padrão (5s)', () => {
    setup({ description: 'Oi' })
    settle(4000)
    expect(screen.getByText('Oi')).toBeTruthy()
    settle(1500)
    expect(screen.queryByText('Oi')).toBeNull()
  })

  it('respeita duration customizada e 0 não fecha sozinho', () => {
    setup({ description: 'Rápido', duration: 1000 })
    settle(1500)
    expect(screen.queryByText('Rápido')).toBeNull()
  })

  it('duration 0 permanece', () => {
    setup({ description: 'Fixo', duration: 0 })
    settle(60000)
    expect(screen.getByText('Fixo')).toBeTruthy()
  })

  it('fecha no ×, que pode ser escondido e renomeado', () => {
    setup({ description: 'Oi', duration: 0 })
    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }))
    settle()
    expect(screen.queryByText('Oi')).toBeNull()
  })

  it('dismissible false esconde o ×', () => {
    setup({ description: 'Oi', dismissible: false, duration: 0 })
    expect(screen.queryByRole('button', { name: 'Fechar' })).toBeNull()
  })

  it('a ação chama onClick e fecha', () => {
    const onClick = jest.fn()
    setup({ description: 'Excluído', duration: 0, action: { label: 'Desfazer', onClick } })
    fireEvent.press(screen.getByRole('button', { name: 'Desfazer' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    settle()
    expect(screen.queryByText('Excluído')).toBeNull()
  })

  it('dismiss(id) fecha o toast', () => {
    setup({ description: 'Oi', duration: 0 })
    fireEvent.press(screen.getByText('fechar-0'))
    settle()
    expect(screen.queryByText('Oi')).toBeNull()
  })

  it('erro usa role alert e região assertiva; info é polida', () => {
    setup({ status: 'error', description: 'Falhou', duration: 0 })
    expect(
      screen.UNSAFE_getByProps({ accessibilityRole: 'alert' }).props.accessibilityLiveRegion,
    ).toBe('assertive')
  })

  it('info tem região polida e título com a cor do status', () => {
    setup({ title: 'Info', description: 'x', duration: 0 })
    expect(screen.UNSAFE_queryByProps({ accessibilityRole: 'alert' })).toBeNull()
    expect(screen.UNSAFE_getByProps({ accessibilityLiveRegion: 'polite' })).toBeTruthy()
    expect(screen.getByText('Info').props.className).toContain('text-status-info-text')
  })

  it('empilha vários toasts', () => {
    setup({ description: 'Um', duration: 0 })
    fireEvent.press(screen.getByText('disparar'))
    expect(screen.getAllByText('Um')).toHaveLength(2)
  })

  describe('swipe e reposicionamento', () => {
    // O cartão que se arrasta: o `View` nativo que tem os handlers do PanResponder.
    const card = () =>
      screen.UNSAFE_root.findAll(
        (node: { type: unknown; props: Record<string, unknown> }) =>
          node.type === 'View' && typeof node.props.onMoveShouldSetResponder === 'function',
      )[0]

    // os handlers mudam estado: dentro de `act`, como um toque real dentro do React
    const gestureOf = (element: ReturnType<typeof card>) => {
      const g = makeGesture(element)
      return {
        down: g.down,
        move: (x: number, y: number, t: number) => {
          let owner = false
          act(() => {
            owner = g.move(x, y, t)
          })
          return owner
        },
        up: (x: number, y: number, t: number) => act(() => g.up(x, y, t)),
      }
    }

    it('arrastar para o lado além de 50px dispensa o toast', () => {
      setup({ description: 'Mensagem', duration: 0 })
      const gesture = gestureOf(card())
      gesture.down(200, 80)
      expect(gesture.move(230, 80, 1000)).toBe(true)
      gesture.move(300, 80, 2000)
      gesture.up(300, 80, 2000)
      settle()
      expect(screen.queryByText('Mensagem')).toBeNull()
    })

    it('para a esquerda também, e um gesto rápido dispensa mesmo curto', () => {
      setup({ description: 'Mensagem', duration: 0 })
      const gesture = gestureOf(card())
      gesture.down(200, 80, 0)
      gesture.move(190, 80, 16)
      gesture.move(170, 80, 32) // 30px em 16ms
      gesture.up(170, 80, 32)
      settle()
      expect(screen.queryByText('Mensagem')).toBeNull()
    })

    it('um arraste curto e lento volta ao lugar e o toast continua', () => {
      setup({ description: 'Mensagem', duration: 0 })
      const gesture = gestureOf(card())
      gesture.down(200, 80)
      gesture.move(215, 80, 1000)
      gesture.move(230, 80, 2000) // 30px
      gesture.up(230, 80, 2000)
      settle()
      expect(screen.getByText('Mensagem')).toBeTruthy()
    })

    it('o gesto vertical é ignorado', () => {
      setup({ description: 'Mensagem', duration: 0 })
      const gesture = gestureOf(card())
      gesture.down(200, 80)
      expect(gesture.move(205, 160, 1000)).toBe(false)
    })

    it('o auto-fechar pausa enquanto o dedo arrasta', () => {
      setup({ description: 'Mensagem', duration: 1000 })
      const gesture = gestureOf(card())
      gesture.down(200, 80)
      gesture.move(215, 80, 1000)
      gesture.move(225, 80, 2000)
      act(() => jest.advanceTimersByTime(3000)) // passou do `duration`, mas o dedo segura
      expect(screen.getByText('Mensagem')).toBeTruthy()
      gesture.up(225, 80, 3000) // solta antes do limite: volta e o tempo corre de novo
      settle(1500)
      expect(screen.queryByText('Mensagem')).toBeNull()
    })

    it('quando um toast sai, os de baixo deslizam para o lugar (LayoutAnimation)', () => {
      const configureNext = jest.spyOn(LayoutAnimation, 'configureNext')
      setup({ description: 'Mensagem', duration: 0 })
      fireEvent.press(screen.getByText('fechar-0'))
      settle()
      expect(configureNext).toHaveBeenCalled()
      configureNext.mockRestore()
    })
  })
})
