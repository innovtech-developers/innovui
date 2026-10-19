import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Breadcrumb, BreadcrumbItem } from './breadcrumb'

function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/config">Configurações</BreadcrumbItem>
      <BreadcrumbItem current>Perfil</BreadcrumbItem>
    </Breadcrumb>
  )
}

describe('Breadcrumb', () => {
  it('é uma navegação nomeada com uma lista de itens', () => {
    render(<Example />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('permite trocar o nome da navegação', () => {
    render(
      <Breadcrumb aria-label="Você está aqui">
        <BreadcrumbItem current>Início</BreadcrumbItem>
      </Breadcrumb>,
    )
    expect(screen.getByRole('navigation', { name: 'Você está aqui' })).toBeInTheDocument()
  })

  it('os itens anteriores são links e o atual não', () => {
    render(<Example />)
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Configurações' })).toHaveAttribute('href', '/config')
    expect(screen.queryByRole('link', { name: 'Perfil' })).not.toBeInTheDocument()
  })

  it('o item atual tem aria-current="page" e peso medium', () => {
    render(<Example />)
    const current = screen.getByText('Perfil')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current).toHaveClass('iu:font-medium')
  })

  it('os separadores são decorativos e o do último item fica escondido', () => {
    const { container } = render(<Example />)
    const separators = container.querySelectorAll('svg')
    expect(separators).toHaveLength(3)
    for (const separator of separators) expect(separator).toHaveAttribute('aria-hidden', 'true')
    expect(separators[2]).toHaveClass('iu:group-last:hidden')
  })

  it('com asChild, usa o elemento filho como link (ex.: o Link do roteador)', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem asChild>
          <a href="/roteador" data-router="sim">
            Início
          </a>
        </BreadcrumbItem>
      </Breadcrumb>,
    )
    const link = screen.getByRole('link', { name: 'Início' })
    expect(link).toHaveAttribute('href', '/roteador')
    expect(link).toHaveAttribute('data-router', 'sim')
    expect(link).toHaveClass('iu:text-[var(--color-text-secondary)]')
  })

  it('mescla className e repassa props HTML', () => {
    render(
      <Breadcrumb className="iu:mt-4" data-testid="nav">
        <BreadcrumbItem current className="iu:ml-2">
          Início
        </BreadcrumbItem>
      </Breadcrumb>,
    )
    expect(screen.getByTestId('nav')).toHaveClass('iu:mt-4')
    expect(screen.getByRole('listitem')).toHaveClass('iu:ml-2')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Example />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
