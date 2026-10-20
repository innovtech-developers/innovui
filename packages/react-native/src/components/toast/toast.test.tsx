import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { Pressable, Text } from 'react-native'
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
})
