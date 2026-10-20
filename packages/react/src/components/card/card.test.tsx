import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Card } from './card'

describe('Card', () => {
  it('usa os tokens do DS: surface/elevated, radius/md e shadow-md', () => {
    render(<Card>Conteúdo</Card>)
    expect(screen.getByText('Conteúdo')).toHaveClass(
      'iu:rounded-md',
      'iu:bg-[var(--color-surface-elevated)]',
      'iu:border-[var(--color-border-default)]',
      'iu:shadow-md',
    )
  })

  it.each([
    ['md', 'iu:p-4'],
    ['lg', 'iu:p-6'],
  ] as const)('padding %s aplica %s', (padding, cls) => {
    render(<Card padding={padding}>x</Card>)
    expect(screen.getByText('x')).toHaveClass(cls)
  })

  it('padding padrão é md e none não adiciona padding', () => {
    const { rerender } = render(<Card>x</Card>)
    expect(screen.getByText('x')).toHaveClass('iu:p-4')
    rerender(<Card padding="none">x</Card>)
    expect(screen.getByText('x')).not.toHaveClass('iu:p-4')
  })

  it('className sobrescreve o padding sem duplicar', () => {
    render(<Card className="iu:p-8">x</Card>)
    expect(screen.getByText('x')).toHaveClass('iu:p-8')
    expect(screen.getByText('x')).not.toHaveClass('iu:p-4')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <Card>
        <h3>Título</h3>
        <p>Texto</p>
      </Card>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
