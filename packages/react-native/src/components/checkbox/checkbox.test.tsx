import { fireEvent, render, screen } from '@testing-library/react-native'
import { Checkbox } from './checkbox'

const box = () => screen.getByRole('checkbox')

describe('Checkbox', () => {
  it('renderiza o label e alterna (não controlado) avisando onCheckedChange', () => {
    const onCheckedChange = jest.fn()
    render(<Checkbox label="Aceito os termos" onCheckedChange={onCheckedChange} />)
    expect(screen.getByText('Aceito os termos')).toBeTruthy()
    expect(box()).not.toBeChecked()
    fireEvent.press(box())
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
    expect(box()).toBeChecked()
    fireEvent.press(box())
    expect(onCheckedChange).toHaveBeenLastCalledWith(false)
  })

  it('controlado: só muda quando checked muda', () => {
    const onCheckedChange = jest.fn()
    const { rerender } = render(<Checkbox checked={false} onCheckedChange={onCheckedChange} />)
    fireEvent.press(box())
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(box()).not.toBeChecked()
    rerender(<Checkbox checked onCheckedChange={onCheckedChange} />)
    expect(box()).toBeChecked()
  })

  it('defaultChecked começa marcado', () => {
    render(<Checkbox defaultChecked />)
    expect(box()).toBeChecked()
  })

  it('indeterminate é anunciado como misto e o toque marca', () => {
    const onCheckedChange = jest.fn()
    render(<Checkbox indeterminate onCheckedChange={onCheckedChange} />)
    expect(box().props.accessibilityState).toMatchObject({ checked: 'mixed' })
    fireEvent.press(box())
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('desabilitado não dispara e usa os tokens de desabilitado', () => {
    const onCheckedChange = jest.fn()
    render(<Checkbox label="Opção" disabled onCheckedChange={onCheckedChange} />)
    expect(box()).toBeDisabled()
    fireEvent.press(box())
    expect(onCheckedChange).not.toHaveBeenCalled()
    expect(screen.getByText('Opção').props.className).toContain('text-selection-text-disabled')
  })

  it('marcado usa o preenchimento de selecionado; o erro vence a borda', () => {
    const { rerender } = render(<Checkbox label="A" defaultChecked />)
    const view = () => box().children[0] as { props: { className: string } }
    expect(view().props.className).toContain('bg-selection-bg-selected')
    rerender(<Checkbox label="A" defaultChecked error />)
    expect(view().props.className).toContain('border-status-error-border')
    expect(view().props.className).not.toContain('border-selection-border-selected')
  })
})
