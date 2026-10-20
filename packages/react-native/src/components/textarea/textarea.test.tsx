import { fireEvent, render, screen } from '@testing-library/react-native'
import { Textarea } from './textarea'

const area = () => screen.getByPlaceholderText('Mensagem')

describe('Textarea', () => {
  it('é multilinha e dispara onChangeText', () => {
    const onChangeText = jest.fn()
    render(<Textarea placeholder="Mensagem" onChangeText={onChangeText} />)
    expect(area().props.multiline).toBe(true)
    fireEvent.changeText(area(), 'olá')
    expect(onChangeText).toHaveBeenCalledWith('olá')
  })

  it('usa md por padrão, com altura mínima', () => {
    const { rerender } = render(<Textarea placeholder="Mensagem" />)
    expect(area().props.className).toContain('p-3')
    expect(area().props.className).toContain('min-h-30')
    rerender(<Textarea placeholder="Mensagem" size="sm" />)
    expect(area().props.className).toContain('p-2')
  })

  it('error, disabled e readOnly', () => {
    const { rerender } = render(<Textarea placeholder="Mensagem" error />)
    expect(area().props.className).toContain('border-field-border-error')
    rerender(<Textarea placeholder="Mensagem" disabled />)
    expect(area().props.editable).toBe(false)
    expect(area().props.className).toContain('bg-field-bg-disabled')
    rerender(<Textarea placeholder="Mensagem" readOnly />)
    expect(area().props.editable).toBe(false)
    expect(area().props.className).toContain('border-transparent')
  })

  it('mescla className', () => {
    render(<Textarea placeholder="Mensagem" className="mt-4" />)
    expect(area().props.className).toContain('mt-4')
  })
})
