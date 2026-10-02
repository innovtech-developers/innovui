import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renderiza com placeholder', () => {
    render(<Textarea placeholder="Descreva com detalhes…" />)
    expect(screen.getByPlaceholderText('Descreva com detalhes…')).toBeInTheDocument()
  })

  it('aceita digitação e dispara onChange', async () => {
    const onChange = vi.fn()
    render(<Textarea onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'abc')
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('fica desabilitado via a prop disabled', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('marca aria-invalid quando error está ativo', () => {
    render(<Textarea error />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('mescla className customizada', () => {
    render(<Textarea className="iu:mt-4" />)
    expect(screen.getByRole('textbox')).toHaveClass('iu:mt-4')
  })

  it.each(['lg', 'md', 'sm'] as const)('renderiza o tamanho %s', (size) => {
    render(<Textarea size={size} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Textarea aria-label="Descrição" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
