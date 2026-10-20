import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { Slider } from './slider'

// Largura 220 com alça de 20: curso útil de 200px, então 1px = 0,5 do valor (0–100).
const layout = (el: ReturnType<typeof screen.getByTestId>) =>
  fireEvent(el, 'layout', { nativeEvent: { layout: { width: 220, height: 44 } } })
const at = (locationX: number) => ({ nativeEvent: { locationX } })

function setup(props: Parameters<typeof Slider>[0] = {}) {
  render(<Slider testID="s" accessibilityLabel="Volume" {...props} />)
  const root = screen.getByTestId('s')
  layout(root)
  return root
}

describe('Slider', () => {
  it('é ajustável, com nome, valor e limites', () => {
    setup({ defaultValue: [40], min: 0, max: 100 })
    const thumb = screen.getByRole('adjustable', { name: 'Volume' })
    expect(thumb.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 40 })
  })

  it('sem valor inicial começa no mínimo', () => {
    render(<Slider accessibilityLabel="Volume" min={10} max={50} />)
    expect(screen.getByRole('adjustable').props.accessibilityValue).toMatchObject({ now: 10 })
  })

  it('tocar na barra move a alça e avisa onValueChange', () => {
    const onValueChange = jest.fn()
    const onValueCommit = jest.fn()
    const root = setup({ defaultValue: [0], onValueChange, onValueCommit })
    fireEvent(root, 'responderGrant', at(110)) // 100px úteis → 50
    expect(onValueChange).toHaveBeenLastCalledWith([50])
    fireEvent(root, 'responderMove', at(210)) // além do fim → 100
    expect(onValueChange).toHaveBeenLastCalledWith([100])
    fireEvent(root, 'responderRelease', at(210))
    expect(onValueCommit).toHaveBeenCalledWith([100])
  })

  it('respeita o step', () => {
    const onValueChange = jest.fn()
    const root = setup({ defaultValue: [0], step: 25, onValueChange })
    fireEvent(root, 'responderGrant', at(100)) // ~45 → 50
    expect(onValueChange).toHaveBeenLastCalledWith([50])
  })

  it('ações de acessibilidade mudam o valor pelo step', () => {
    const onValueChange = jest.fn()
    setup({ defaultValue: [40], step: 5, onValueChange })
    const thumb = screen.getByRole('adjustable')
    act(() => thumb.props.onAccessibilityAction({ nativeEvent: { actionName: 'increment' } }))
    expect(onValueChange).toHaveBeenLastCalledWith([45])
    act(() => thumb.props.onAccessibilityAction({ nativeEvent: { actionName: 'decrement' } }))
    expect(onValueChange).toHaveBeenLastCalledWith([40])
  })

  it('com dois valores é um intervalo: alças nomeadas com o número e que não se cruzam', () => {
    const onValueChange = jest.fn()
    const root = setup({ accessibilityLabel: 'Preço', defaultValue: [20, 80], onValueChange })
    expect(screen.getByRole('adjustable', { name: 'Preço 1' })).toBeTruthy()
    expect(screen.getByRole('adjustable', { name: 'Preço 2' })).toBeTruthy()
    fireEvent(root, 'responderGrant', at(30)) // perto de 20 → alça 1 vai a 10
    expect(onValueChange).toHaveBeenLastCalledWith([10, 80])
    fireEvent(root, 'responderMove', at(210)) // tenta passar da alça 2
    expect(onValueChange).toHaveBeenLastCalledWith([80, 80])
  })

  it('thumbLabels dá nomes próprios às alças', () => {
    setup({ defaultValue: [20, 80], thumbLabels: ['Mínimo', 'Máximo'] })
    expect(screen.getByRole('adjustable', { name: 'Mínimo' })).toBeTruthy()
    expect(screen.getByRole('adjustable', { name: 'Máximo' })).toBeTruthy()
  })

  it('funciona controlado', () => {
    const { rerender } = render(<Slider accessibilityLabel="Volume" value={[30]} />)
    expect(screen.getByRole('adjustable').props.accessibilityValue).toMatchObject({ now: 30 })
    rerender(<Slider accessibilityLabel="Volume" value={[70]} />)
    expect(screen.getByRole('adjustable').props.accessibilityValue).toMatchObject({ now: 70 })
  })

  it('desabilitado não responde a toques nem a ações', () => {
    const onValueChange = jest.fn()
    const root = setup({ defaultValue: [40], disabled: true, onValueChange })
    expect(root.props.onStartShouldSetResponder()).toBe(false)
    expect(screen.getByRole('adjustable').props.accessibilityState).toMatchObject({
      disabled: true,
    })
    expect(screen.getByRole('adjustable').props.onAccessibilityAction).toBeUndefined()
  })

  it('className chega à raiz', () => {
    const root = setup({ className: 'max-w-xs' })
    expect(root.props.className).toContain('max-w-xs')
  })
})
