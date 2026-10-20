import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Stack } from './stack'

describe('Stack', () => {
  it('padrão: coluna com gap de 16px', () => {
    render(<Stack data-testid="s" />)
    expect(screen.getByTestId('s')).toHaveClass('iu:flex', 'iu:flex-col', 'iu:gap-4')
  })

  it('direction="row" vira linha', () => {
    render(<Stack data-testid="s" direction="row" />)
    expect(screen.getByTestId('s')).toHaveClass('iu:flex-row')
    expect(screen.getByTestId('s')).not.toHaveClass('iu:flex-col')
  })

  it.each([
    [0, 'iu:gap-0'],
    [1, 'iu:gap-1'],
    [2, 'iu:gap-2'],
    [3, 'iu:gap-3'],
    [4, 'iu:gap-4'],
    [6, 'iu:gap-6'],
    [8, 'iu:gap-8'],
  ] as const)('gap %s aplica %s', (gap, cls) => {
    render(<Stack data-testid="s" gap={gap} />)
    expect(screen.getByTestId('s')).toHaveClass(cls)
  })

  it('align, justify e wrap aplicam as classes de flexbox', () => {
    render(<Stack data-testid="s" align="center" justify="between" wrap />)
    expect(screen.getByTestId('s')).toHaveClass(
      'iu:items-center',
      'iu:justify-between',
      'iu:flex-wrap',
    )
  })

  it('sem align/justify/wrap não adiciona essas classes', () => {
    render(<Stack data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(el.className).not.toMatch(/items-|justify-|flex-wrap/)
  })

  it('className sobrescreve o gap sem duplicar', () => {
    render(<Stack data-testid="s" className="iu:gap-10" />)
    expect(screen.getByTestId('s')).toHaveClass('iu:gap-10')
    expect(screen.getByTestId('s')).not.toHaveClass('iu:gap-4')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <Stack>
        <p>A</p>
        <p>B</p>
      </Stack>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
