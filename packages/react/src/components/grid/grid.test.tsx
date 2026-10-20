import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Grid, GridItem } from './grid'

describe('Grid', () => {
  it('por padrão usa o grid do DS (4/8/12 colunas) com gap de 16px', () => {
    render(<Grid data-testid="g" />)
    expect(screen.getByTestId('g')).toHaveClass(
      'iu:grid',
      'iu:grid-cols-4',
      'iu:tablet:grid-cols-8',
      'iu:desktop:grid-cols-12',
      'iu:gap-4',
    )
  })

  it.each([
    [1, 'iu:grid-cols-1'],
    [2, 'iu:grid-cols-2'],
    [3, 'iu:grid-cols-3'],
    [4, 'iu:grid-cols-4'],
    [6, 'iu:grid-cols-6'],
    [12, 'iu:grid-cols-12'],
  ] as const)('columns %s fixa as colunas e desliga o responsivo', (columns, cls) => {
    render(<Grid data-testid="g" columns={columns} />)
    expect(screen.getByTestId('g')).toHaveClass(cls)
    expect(screen.getByTestId('g')).not.toHaveClass('iu:tablet:grid-cols-8')
  })

  it.each([
    [0, 'iu:gap-0'],
    [2, 'iu:gap-2'],
    [8, 'iu:gap-8'],
  ] as const)('gap %s aplica %s', (gap, cls) => {
    render(<Grid data-testid="g" gap={gap} />)
    expect(screen.getByTestId('g')).toHaveClass(cls)
  })

  it('className sobrescreve o gap sem duplicar', () => {
    render(<Grid data-testid="g" className="iu:gap-10" />)
    expect(screen.getByTestId('g')).toHaveClass('iu:gap-10')
    expect(screen.getByTestId('g')).not.toHaveClass('iu:gap-4')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <Grid>
        <GridItem span={4}>A</GridItem>
        <GridItem span={4}>B</GridItem>
      </Grid>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('GridItem', () => {
  it.each([
    [1, 'iu:col-span-1'],
    [2, 'iu:col-span-2'],
    [3, 'iu:col-span-3'],
    [4, 'iu:col-span-4'],
    [6, 'iu:col-span-6'],
    [8, 'iu:col-span-8'],
    [12, 'iu:col-span-12'],
    ['full', 'iu:col-span-full'],
  ] as const)('span %s aplica %s', (span, cls) => {
    render(<GridItem data-testid="i" span={span} />)
    expect(screen.getByTestId('i')).toHaveClass(cls)
  })

  it('sem span não adiciona classe de coluna', () => {
    render(<GridItem data-testid="i" />)
    expect(screen.getByTestId('i').className).toBe('')
  })
})
