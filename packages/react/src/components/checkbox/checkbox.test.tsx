import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('renderiza o label e conecta via htmlFor/id', () => {
    render(<Checkbox label="Notificações por e-mail" />)
    expect(screen.getByLabelText('Notificações por e-mail')).toBeInTheDocument()
  })

  it('alterna ao clicar e dispara onChange', async () => {
    const onChange = vi.fn()
    render(<Checkbox label="Aceito os termos" onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('alterna por teclado (espaço)', async () => {
    render(<Checkbox label="Aceito os termos" />)
    const checkbox = screen.getByRole('checkbox')
    checkbox.focus()
    await userEvent.keyboard(' ')
    expect(checkbox).toBeChecked()
  })

  it('fica desabilitado via a prop disabled', () => {
    render(<Checkbox label="Opção desabilitada" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('sincroniza a propriedade DOM indeterminate', () => {
    render(<Checkbox label="Selecionar todos" indeterminate />)
    expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true)
  })

  it('o erro vale também quando marcado (borda de erro vence a borda de selecionado)', () => {
    const { container } = render(<Checkbox label="Aceito" error defaultChecked />)
    const box = container.querySelector('span[aria-hidden="true"]')
    expect(box).toHaveClass(
      'iu:peer-checked:border-[var(--color-status-error-border)]',
      'iu:peer-indeterminate:border-[var(--color-status-error-border)]',
    )
  })

  it('aceita a prop error sem quebrar', () => {
    render(<Checkbox label="Campo obrigatório" error />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Checkbox label="Notificações por e-mail" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('não tem violações de acessibilidade no estado indeterminate', async () => {
    const { container } = render(<Checkbox label="Selecionar todos" indeterminate />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
