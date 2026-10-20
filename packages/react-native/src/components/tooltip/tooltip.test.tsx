import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { View } from 'react-native'
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
})
