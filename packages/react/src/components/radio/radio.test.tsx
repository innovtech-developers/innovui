import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Radio } from './radio'

describe('Radio', () => {
  it('renderiza o label e conecta via htmlFor/id', () => {
    render(<Radio label="Mensal" name="plano" />)
    expect(screen.getByLabelText('Mensal')).toBeInTheDocument()
  })

  it('permite apenas uma opção selecionada dentro do mesmo grupo (name)', async () => {
    render(
      <>
        <Radio label="Mensal" name="plano" />
        <Radio label="Anual" name="plano" />
      </>,
    )
    const mensal = screen.getByLabelText('Mensal')
    const anual = screen.getByLabelText('Anual')
    await userEvent.click(mensal)
    expect(mensal).toBeChecked()
    await userEvent.click(anual)
    expect(anual).toBeChecked()
    expect(mensal).not.toBeChecked()
  })

  it('fica desabilitado via a prop disabled', () => {
    render(<Radio label="Opção desabilitada" disabled />)
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('aceita a prop error sem quebrar', () => {
    render(<Radio label="Campo obrigatório" error />)
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <>
        <Radio label="Mensal" name="plano" />
        <Radio label="Anual" name="plano" />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
