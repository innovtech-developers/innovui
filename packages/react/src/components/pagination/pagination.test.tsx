import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { getPages, Pagination } from './pagination'

describe('getPages', () => {
  it('mostra todas quando cabem', () => {
    expect(getPages(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(getPages(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('no começo, agrupa as primeiras e abre reticências à direita', () => {
    expect(getPages(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-right', 20])
    expect(getPages(3, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-right', 20])
  })

  it('no meio, reticências dos dois lados com a atual e as vizinhas', () => {
    expect(getPages(10, 20)).toEqual([1, 'ellipsis-left', 9, 10, 11, 'ellipsis-right', 20])
  })

  it('no fim, abre reticências à esquerda e agrupa as últimas', () => {
    expect(getPages(20, 20)).toEqual([1, 'ellipsis-left', 16, 17, 18, 19, 20])
    expect(getPages(18, 20)).toEqual([1, 'ellipsis-left', 16, 17, 18, 19, 20])
  })

  it('sempre devolve o mesmo número de itens com muitas páginas', () => {
    for (let p = 1; p <= 20; p++) expect(getPages(p, 20)).toHaveLength(7)
  })

  it('siblingCount muda a quantidade de vizinhas', () => {
    expect(getPages(10, 30, 2)).toEqual([
      1,
      'ellipsis-left',
      8,
      9,
      10,
      11,
      12,
      'ellipsis-right',
      30,
    ])
  })

  it('uma página só ou nenhuma', () => {
    expect(getPages(1, 1)).toEqual([1])
    expect(getPages(1, 0)).toEqual([])
  })
})

describe('Pagination', () => {
  it('é uma navegação nomeada com a página atual marcada', () => {
    render(<Pagination page={3} pageCount={5} onPageChange={() => {}} />)
    expect(screen.getByRole('navigation', { name: 'Paginação' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 3' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Página 2' })).not.toHaveAttribute('aria-current')
  })

  it('clicar numa página chama onPageChange com o número', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={1} pageCount={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Página 4' }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('anterior e próxima andam uma página', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Página anterior' }))
    await userEvent.click(screen.getByRole('button', { name: 'Próxima página' }))
    expect(onPageChange).toHaveBeenNthCalledWith(1, 2)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 4)
  })

  it('desabilita anterior na primeira página e próxima na última', () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeEnabled()
    rerender(<Pagination page={5} pageCount={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeDisabled()
  })

  it('com muitas páginas, mostra reticências escondidas dos leitores de tela', () => {
    render(<Pagination page={10} pageCount={20} onPageChange={() => {}} />)
    expect(screen.getAllByText('…')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Página 20' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Página 5' })).not.toBeInTheDocument()
  })

  it('os rótulos são configuráveis', () => {
    render(
      <Pagination
        page={2}
        pageCount={4}
        onPageChange={() => {}}
        aria-label="Pedidos"
        previousLabel="Anterior"
        nextLabel="Seguinte"
      />,
    )
    expect(screen.getByRole('navigation', { name: 'Pedidos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Seguinte' })).toBeInTheDocument()
  })

  it('é navegável por teclado', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />)
    await userEvent.tab() // anterior está desabilitado: o foco vai para a página 1
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Pagination page={10} pageCount={20} onPageChange={() => {}} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
