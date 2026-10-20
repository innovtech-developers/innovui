import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Container } from './container'

describe('Container', () => {
  it('centraliza, ocupa a largura e tem margem lateral responsiva', () => {
    render(<Container data-testid="c" />)
    expect(screen.getByTestId('c')).toHaveClass(
      'iu:mx-auto',
      'iu:w-full',
      'iu:px-4',
      'iu:tablet:px-6',
    )
  })

  it.each([
    ['sm', 'iu:max-w-[640px]'],
    ['md', 'iu:max-w-[960px]'],
    ['lg', 'iu:max-w-[1200px]'],
    ['xl', 'iu:max-w-[1440px]'],
  ] as const)('size %s limita a largura em %s', (size, cls) => {
    render(<Container data-testid="c" size={size} />)
    expect(screen.getByTestId('c')).toHaveClass(cls)
  })

  it('o padrão é lg', () => {
    render(<Container data-testid="c" />)
    expect(screen.getByTestId('c')).toHaveClass('iu:max-w-[1200px]')
  })

  it('className sobrescreve a largura sem duplicar', () => {
    render(<Container data-testid="c" className="iu:max-w-prose" />)
    expect(screen.getByTestId('c')).toHaveClass('iu:max-w-prose')
    expect(screen.getByTestId('c')).not.toHaveClass('iu:max-w-[1200px]')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <Container>
        <p>Conteúdo</p>
      </Container>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
