import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('é decorativo: escondido de leitores de tela', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('usa a variante text por padrão', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('iu:h-3', 'iu:w-full', 'iu:rounded-sm')
  })

  it.each([
    ['text', 'iu:h-3', 'iu:rounded-sm'],
    ['title', 'iu:h-5', 'iu:rounded-sm'],
    ['avatar', 'iu:size-10', 'iu:rounded-full'],
    ['card', 'iu:h-[120px]', 'iu:rounded-md'],
    ['rectangle', 'iu:h-6', 'iu:rounded-md'],
  ] as const)('a variante %s tem as dimensões e o raio do Figma', (variant, size, radius) => {
    const { container } = render(<Skeleton variant={variant} />)
    expect(container.firstChild).toHaveClass(size, radius, 'iu:bg-[var(--color-bg-skeleton)]')
  })

  it('pulsa, exceto com prefers-reduced-motion', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('iu:animate-pulse', 'iu:motion-reduce:animate-none')
  })

  it('className sobrescreve a largura padrão sem duplicar', () => {
    const { container } = render(<Skeleton className="iu:w-[200px]" />)
    expect(container.firstChild).toHaveClass('iu:w-[200px]')
    expect(container.firstChild).not.toHaveClass('iu:w-full')
  })

  it('repassa props HTML', () => {
    const { getByTestId } = render(<Skeleton data-testid="s" />)
    expect(getByTestId('s')).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <div aria-busy="true">
        <Skeleton variant="avatar" />
        <Skeleton variant="title" />
        <Skeleton />
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
