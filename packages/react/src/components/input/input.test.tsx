import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './input'

describe('Input', () => {
  it('renderiza com placeholder', () => {
    render(<Input placeholder="voce@empresa.com" />)
    expect(screen.getByPlaceholderText('voce@empresa.com')).toBeInTheDocument()
  })

  it('aceita digitação e dispara onChange', async () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'abc')
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('fica desabilitado via a prop disabled', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('marca aria-invalid quando error está ativo', () => {
    render(<Input error />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('não marca aria-invalid por padrão', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })

  it('renderiza leadingIcon e trailingIcon', () => {
    render(
      <Input
        leadingIcon={<span data-testid="leading" />}
        trailingIcon={<span data-testid="trailing" />}
      />,
    )
    expect(screen.getByTestId('leading')).toBeInTheDocument()
    expect(screen.getByTestId('trailing')).toBeInTheDocument()
  })

  it('fica desabilitado com ícones (pointer-events no wrapper)', () => {
    render(<Input disabled leadingIcon={<span data-testid="leading" />} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('mescla className customizada', () => {
    render(<Input className="iu:mt-4" />)
    expect(screen.getByRole('textbox')).toHaveClass('iu:mt-4')
  })

  it.each(['lg', 'md', 'sm'] as const)('renderiza o tamanho %s', (size) => {
    render(<Input size={size} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Input aria-label="Nome" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('não tem violações de acessibilidade com ícones', async () => {
    const { container } = render(
      <Input aria-label="Busca" leadingIcon={<span>🔍</span>} trailingIcon={<span>×</span>} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
