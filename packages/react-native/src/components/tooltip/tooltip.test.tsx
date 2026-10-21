import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { StyleSheet, View, type ViewStyle } from 'react-native'
import { Button } from '../button/button'
import { Tooltip } from './tooltip'

beforeEach(() => {
  jest.useFakeTimers()
  jest.spyOn(View.prototype, 'measureInWindow').mockImplementation((cb) => cb(20, 100, 80, 40))
})
afterEach(() => {
  jest.useRealTimers()
  jest.restoreAllMocks()
})

describe('Tooltip', () => {
  it('abre no long press, com título e conteúdo, e não no toque simples', () => {
    const onPress = jest.fn()
    render(
      <Tooltip content="Salva o rascunho" title="Rascunho">
        <Button onPress={onPress}>Salvar</Button>
      </Tooltip>,
    )
    const trigger = screen.getByRole('button', { name: 'Salvar' })
    fireEvent.press(trigger)
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Salva o rascunho')).toBeNull()

    fireEvent(trigger, 'longPress')
    expect(screen.getByText('Salva o rascunho')).toBeTruthy()
    expect(screen.getByText('Rascunho')).toBeTruthy()
  })

  it('expõe o conteúdo como accessibilityHint do gatilho', () => {
    render(
      <Tooltip content="Dica">
        <Button>Ok</Button>
      </Tooltip>,
    )
    expect(screen.getByRole('button', { name: 'Ok' }).props.accessibilityHint).toBe('Dica')
  })

  it('fecha sozinho após a duração', () => {
    const onOpenChange = jest.fn()
    render(
      <Tooltip content="Dica" duration={1000} onOpenChange={onOpenChange}>
        <Button>Ok</Button>
      </Tooltip>,
    )
    fireEvent(screen.getByRole('button', { name: 'Ok' }), 'longPress')
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    act(() => jest.advanceTimersByTime(1000))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    act(() => jest.advanceTimersByTime(500)) // a saída é animada
    expect(screen.queryByText('Dica')).toBeNull()
  })

  it('duration 0 mantém aberto até tocar fora', () => {
    render(
      <Tooltip content="Dica" duration={0} testID="t">
        <Button>Ok</Button>
      </Tooltip>,
    )
    fireEvent(screen.getByRole('button', { name: 'Ok' }), 'longPress')
    act(() => jest.advanceTimersByTime(60000))
    expect(screen.getByText('Dica')).toBeTruthy()
    fireEvent.press(screen.getByTestId('t-backdrop'))
    act(() => jest.advanceTimersByTime(500))
    expect(screen.queryByText('Dica')).toBeNull()
  })

  it('aplica as classes e className', () => {
    render(
      <Tooltip content="Dica" defaultOpen className="px-6" testID="t">
        <Button>Ok</Button>
      </Tooltip>,
    )
    const box = screen.getByTestId('t')
    expect(box.props.className).toContain('bg-bg-inverse')
    expect(box.props.className).toContain('px-6')
  })

  describe('seta, centralização e delayDuration', () => {
    const ARROW = { className: 'absolute size-1.5 rotate-45 bg-bg-inverse' }
    const open = (props: Partial<React.ComponentProps<typeof Tooltip>> = {}) => {
      render(
        <Tooltip content="Dica" {...props}>
          <Button>Ok</Button>
        </Tooltip>,
      )
      fireEvent(screen.getByRole('button', { name: 'Ok' }), 'longPress')
    }
    // o `View` nativo que posiciona o tooltip (o que tem `transformOrigin`)
    const wrapper = () =>
      screen.UNSAFE_root.findAll((node: { props: { style?: unknown } }) =>
        Boolean(
          node.props.style && StyleSheet.flatten(node.props.style as ViewStyle).transformOrigin,
        ),
      ).at(-1)

    it('mostra a seta por padrão, e some com showArrow={false}', () => {
      open()
      expect(screen.UNSAFE_queryAllByProps(ARROW).length).toBeGreaterThan(0)
    })

    it('showArrow={false} tira a seta', () => {
      open({ showArrow: false })
      expect(screen.UNSAFE_queryAllByProps(ARROW)).toHaveLength(0)
    })

    it('fica centrado no gatilho depois de medir a própria largura, e escondido até lá', () => {
      open()
      expect(StyleSheet.flatten(wrapper()?.props.style).opacity).toBe(0)
      act(() => {
        wrapper()?.props.onLayout({
          nativeEvent: { layout: { x: 0, y: 0, width: 100, height: 30 } },
        })
      })
      // gatilho em x=20, largura 80: centro em 60; conteúdo de 100px começa em 10
      expect(StyleSheet.flatten(wrapper()?.props.style).left).toBe(10)
    })

    it('delayDuration vira o tempo de segurar (delayLongPress) do gatilho', () => {
      open({ delayDuration: 300 })
      expect(screen.UNSAFE_getByType(Button).props.delayLongPress).toBe(300)
    })
  })
})
