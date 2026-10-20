import { fireEvent, render, screen } from '@testing-library/react-native'
import { Switch } from './switch'

const toggle = () => screen.getByRole('switch')

describe('Switch', () => {
  it('renderiza o label e alterna imediatamente', () => {
    const onCheckedChange = jest.fn()
    render(<Switch label="Notificações push" onCheckedChange={onCheckedChange} />)
    expect(screen.getByText('Notificações push')).toBeTruthy()
    expect(toggle()).not.toBeChecked()
    fireEvent.press(toggle())
    expect(toggle()).toBeChecked()
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    fireEvent.press(toggle())
    expect(onCheckedChange).toHaveBeenLastCalledWith(false)
  })

  it('controlado e defaultChecked', () => {
    const { rerender } = render(<Switch checked={false} />)
    fireEvent.press(toggle())
    expect(toggle()).not.toBeChecked()
    rerender(<Switch checked />)
    expect(toggle()).toBeChecked()
    rerender(<Switch defaultChecked />)
    expect(toggle()).toBeChecked()
  })

  it('trilho liga e desliga pelas cores', () => {
    const { rerender } = render(<Switch />)
    const track = () => toggle().children[0] as { props: { className: string } }
    expect(track().props.className).toContain('bg-selection-toggle-track-off')
    rerender(<Switch checked />)
    expect(track().props.className).toContain('bg-selection-bg-selected')
  })

  it('desabilitado não dispara', () => {
    const onCheckedChange = jest.fn()
    render(<Switch label="Opção" disabled onCheckedChange={onCheckedChange} />)
    expect(toggle()).toBeDisabled()
    fireEvent.press(toggle())
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
