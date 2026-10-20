import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Link } from './link'

describe('Link', () => {
  it('renderiza um <a> com href, sublinhado e a cor da marca', () => {
    render(<Link href="/docs">Docs</Link>)
    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link).toHaveAttribute('href', '/docs')
    expect(link).toHaveClass('iu:underline', 'iu:text-[var(--color-text-brand)]')
  })

  it('asChild aplica o estilo ao elemento filho', () => {
    render(
      <Link asChild>
        <a href="/rota" data-router="true">
          Rota
        </a>
      </Link>,
    )
    const link = screen.getByRole('link', { name: 'Rota' })
    expect(link).toHaveAttribute('data-router', 'true')
    expect(link).toHaveClass('iu:underline')
    expect(link.querySelector('a')).toBeNull()
  })

  it('é alcançável pelo teclado', async () => {
    render(<Link href="/x">X</Link>)
    await userEvent.tab()
    expect(screen.getByRole('link')).toHaveFocus()
  })

  it('className e props HTML chegam ao elemento', () => {
    render(
      <Link href="https://x.dev" target="_blank" rel="noreferrer" className="iu:font-bold">
        Externo
      </Link>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveClass('iu:font-bold')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Link href="/docs">Docs</Link>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
