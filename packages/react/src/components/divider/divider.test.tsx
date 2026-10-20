import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Divider } from './divider'

describe('Divider', () => {
  it('é um separador horizontal por padrão', () => {
    render(<Divider />)
    const sep = screen.getByRole('separator')
    expect(sep).toHaveAttribute('aria-orientation', 'horizontal')
    expect(sep).toHaveClass('iu:h-px', 'iu:w-full', 'iu:bg-[var(--color-border-default)]')
  })

  it('aceita a orientação vertical', () => {
    render(<Divider orientation="vertical" />)
    const sep = screen.getByRole('separator')
    expect(sep).toHaveAttribute('aria-orientation', 'vertical')
    expect(sep).toHaveClass('iu:w-px', 'iu:self-stretch')
  })

  it('className e props HTML chegam ao elemento', () => {
    render(<Divider className="iu:my-4" data-testid="d" />)
    expect(screen.getByTestId('d')).toHaveClass('iu:my-4')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <p>Acima</p>
        <Divider />
        <p>Abaixo</p>
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
