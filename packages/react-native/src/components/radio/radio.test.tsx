import { fireEvent, render, screen } from '@testing-library/react-native'
import { useState } from 'react'
import { Radio } from './radio'

const radio = (name: string) => screen.getByRole('radio', { name })

function Group() {
  const [plan, setPlan] = useState('mensal')
  return (
    <>
      <Radio label="Mensal" checked={plan === 'mensal'} onCheckedChange={() => setPlan('mensal')} />
      <Radio label="Anual" checked={plan === 'anual'} onCheckedChange={() => setPlan('anual')} />
    </>
  )
}

describe('Radio', () => {
  it('renderiza o label e seleciona avisando onCheckedChange', () => {
    const onCheckedChange = jest.fn()
    render(<Radio label="Mensal" onCheckedChange={onCheckedChange} />)
    expect(radio('Mensal')).not.toBeChecked()
    fireEvent.press(radio('Mensal'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(radio('Mensal')).toBeChecked()
  })

  it('tocar numa opção já marcada não faz nada', () => {
    const onCheckedChange = jest.fn()
    render(<Radio label="Mensal" defaultChecked onCheckedChange={onCheckedChange} />)
    fireEvent.press(radio('Mensal'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('forma um grupo controlando checked', () => {
    render(<Group />)
    expect(radio('Mensal')).toBeChecked()
    fireEvent.press(radio('Anual'))
    expect(radio('Anual')).toBeChecked()
    expect(radio('Mensal')).not.toBeChecked()
  })

  it('desabilitado não dispara', () => {
    const onCheckedChange = jest.fn()
    render(<Radio label="Opção" disabled onCheckedChange={onCheckedChange} />)
    expect(radio('Opção')).toBeDisabled()
    fireEvent.press(radio('Opção'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('selecionado preenche o círculo; o erro vence a borda', () => {
    const { rerender } = render(<Radio label="A" defaultChecked />)
    const circle = () => radio('A').children[0] as { props: { className: string } }
    expect(circle().props.className).toContain('bg-selection-bg-selected')
    rerender(<Radio label="A" defaultChecked error />)
    expect(circle().props.className).toContain('border-status-error-border')
  })
})
