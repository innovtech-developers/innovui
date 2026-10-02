import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from './switch'

describe('Switch', () => {
  it('renderiza o label e conecta via htmlFor/id', () => {
    render(<Switch label="Modo escuro" />)
    expect(screen.getByLabelText('Modo escuro')).toBeInTheDocument()
  })

  it('usa role="switch"', () => {
    render(<Switch label="Modo escuro" />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('alterna ao clicar, com efeito imediato (sem precisar de submit)', async () => {
    const onChange = vi.fn()
    render(<Switch label="Notificações push" onChange={onChange} />)
    const toggle = screen.getByRole('switch')
    expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    expect(toggle).toBeChecked()
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('fica desabilitado via a prop disabled', () => {
    render(<Switch label="Opção desabilitada" disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Switch label="Modo escuro" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
