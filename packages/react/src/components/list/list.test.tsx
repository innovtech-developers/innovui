import { render, screen, within } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { List, ListItem } from './list'

describe('List', () => {
  it('é uma lista semântica com itens', () => {
    render(
      <List>
        <ListItem title="Ada" />
        <ListItem title="Grace" />
      </List>,
    )
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('sem estilo de lista nativo; divided adiciona linhas entre os itens', () => {
    const { rerender } = render(<List data-testid="l" />)
    expect(screen.getByTestId('l')).toHaveClass('iu:list-none')
    expect(screen.getByTestId('l')).not.toHaveClass('iu:divide-y')
    rerender(<List data-testid="l" divided />)
    expect(screen.getByTestId('l')).toHaveClass('iu:divide-y')
  })

  it('className chega à lista', () => {
    render(<List data-testid="l" className="iu:max-w-sm" />)
    expect(screen.getByTestId('l')).toHaveClass('iu:max-w-sm')
  })
})

describe('ListItem', () => {
  it('mostra título, descrição, leading e trailing', () => {
    render(
      <List>
        <ListItem
          title="Ada Lovelace"
          description="Matemática"
          leading={<span data-testid="lead" />}
          trailing={<button type="button">Ver</button>}
        />
      </List>,
    )
    const item = screen.getByRole('listitem')
    expect(within(item).getByText('Ada Lovelace')).toBeInTheDocument()
    expect(within(item).getByText('Matemática')).toBeInTheDocument()
    expect(within(item).getByTestId('lead')).toBeInTheDocument()
    expect(within(item).getByRole('button', { name: 'Ver' })).toBeInTheDocument()
  })

  it('sem description não renderiza o texto de apoio', () => {
    render(
      <List>
        <ListItem title="Só título" />
      </List>,
    )
    expect(screen.getByRole('listitem').firstElementChild?.children).toHaveLength(1)
  })

  it('children entram abaixo do texto', () => {
    render(
      <List>
        <ListItem title="T">
          <em>extra</em>
        </ListItem>
      </List>,
    )
    expect(screen.getByText('extra')).toBeInTheDocument()
  })

  it('className chega ao item', () => {
    render(
      <List>
        <ListItem title="T" className="iu:py-6" />
      </List>,
    )
    expect(screen.getByRole('listitem')).toHaveClass('iu:py-6')
    expect(screen.getByRole('listitem')).not.toHaveClass('iu:py-3')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <List divided>
        <ListItem title="Ada" description="Matemática" />
        <ListItem title="Grace" description="Computação" />
      </List>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
