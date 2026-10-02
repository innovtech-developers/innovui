import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Input } from '../input/input'
import { Field } from './field'

describe('Field', () => {
  it('conecta label ao controle via htmlFor/id', () => {
    render(
      <Field label="E-mail">
        <Input />
      </Field>,
    )
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('exibe o asterisco quando required', () => {
    render(
      <Field label="E-mail" required>
        <Input />
      </Field>,
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('conecta o supportingText via aria-describedby', () => {
    render(
      <Field label="E-mail" supportingText="Usaremos para enviar o acesso.">
        <Input />
      </Field>,
    )
    const input = screen.getByLabelText('E-mail')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'Usaremos para enviar o acesso.',
    )
  })

  it('propaga error para o controle (aria-invalid)', () => {
    render(
      <Field label="E-mail" error supportingText="Formato inválido.">
        <Input />
      </Field>,
    )
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true')
  })

  it('propaga disabled para o controle', () => {
    render(
      <Field label="E-mail" disabled>
        <Input />
      </Field>,
    )
    expect(screen.getByLabelText('E-mail')).toBeDisabled()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <Field label="E-mail" required supportingText="Usaremos para enviar o acesso.">
        <Input />
      </Field>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
