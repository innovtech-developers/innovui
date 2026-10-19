import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('renderiza o texto', () => {
    render(<Badge>Pago</Badge>)
    expect(screen.getByText('Pago')).toBeInTheDocument()
  })

  it('usa o status neutral por padrão', () => {
    render(<Badge>Pago</Badge>)
    expect(screen.getByText('Pago')).toHaveClass('iu:bg-[var(--color-status-neutral-bg)]')
  })

  it.each(['success', 'error', 'warning', 'info', 'neutral', 'pending'] as const)(
    'aplica as cores do status %s',
    (status) => {
      render(<Badge status={status}>Texto</Badge>)
      const badge = screen.getByText('Texto')
      expect(badge).toHaveClass(`iu:bg-[var(--color-status-${status}-bg)]`)
      expect(badge).toHaveClass(`iu:text-[var(--color-status-${status}-text)]`)
    },
  )

  it('mostra o indicador circular só com dot, escondido de leitores de tela', () => {
    const { container, rerender } = render(<Badge>Pago</Badge>)
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
    rerender(<Badge dot>Pago</Badge>)
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('iu:bg-current')
  })

  it('mescla className e repassa props HTML', () => {
    render(
      <Badge className="iu:mt-4" data-testid="b">
        Pago
      </Badge>,
    )
    expect(screen.getByTestId('b')).toHaveClass('iu:mt-4', 'iu:rounded-full')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <Badge status="success" dot>
        Pago
      </Badge>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
