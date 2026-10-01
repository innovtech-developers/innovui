import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('anuncia o carregamento para leitores de tela', () => {
    render(<Spinner />)
    expect(screen.getByRole('status', { name: 'Carregando' })).toBeInTheDocument()
  })

  it('aplica o tamanho correto', () => {
    render(<Spinner size="lg" />)
    expect(screen.getByRole('status')).toHaveClass('iu:size-6')
  })

  it('mescla className customizada', () => {
    render(<Spinner className="iu:mt-4" />)
    expect(screen.getByRole('status')).toHaveClass('iu:mt-4')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Spinner />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
