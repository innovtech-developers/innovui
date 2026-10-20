import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

function renderTable() {
  return render(
    <Table>
      <TableCaption>Pedidos recentes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Pedido</TableHead>
          <TableHead aria-sort="ascending">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>#1042</TableCell>
          <TableCell>R$ 120,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1043</TableCell>
          <TableCell>R$ 89,90</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  )
}

describe('Table', () => {
  it('é uma tabela semântica nomeada pelo caption', () => {
    renderTable()
    expect(screen.getByRole('table', { name: 'Pedidos recentes' })).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getAllByRole('cell')).toHaveLength(4)
  })

  it('o cabeçalho tem scope="col" por padrão e aceita aria-sort', () => {
    renderTable()
    const valor = screen.getByRole('columnheader', { name: 'Valor' })
    expect(valor).toHaveAttribute('scope', 'col')
    expect(valor).toHaveAttribute('aria-sort', 'ascending')
  })

  it('scope pode ser trocado (cabeçalho de linha)', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableHead scope="row">Total</TableHead>
          </tr>
        </tbody>
      </table>,
    )
    expect(screen.getByRole('rowheader', { name: 'Total' })).toHaveAttribute('scope', 'row')
  })

  it('o contêiner rola na horizontal em telas estreitas', () => {
    renderTable()
    expect(screen.getByRole('table').parentElement).toHaveClass('iu:w-full', 'iu:overflow-x-auto')
  })

  it('o corpo destaca a linha no hover e o cabeçalho não', () => {
    renderTable()
    const body = screen.getAllByRole('rowgroup')[1]
    expect(body?.className).toContain('iu:[&_tr:hover]:bg-[var(--color-bg-secondary)]')
    expect(screen.getAllByRole('rowgroup')[0]?.className).not.toContain('hover')
  })

  it('className chega a cada parte', () => {
    render(
      <Table className="iu:min-w-[600px]" data-testid="t">
        <TableHeader className="iu:bg-transparent">
          <TableRow className="iu:h-12">
            <TableHead className="iu:w-24">H</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="iu:text-xs">
          <TableRow>
            <TableCell className="iu:text-right">C</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
    expect(screen.getByTestId('t')).toHaveClass('iu:min-w-[600px]')
    expect(screen.getByRole('columnheader')).toHaveClass('iu:w-24')
    expect(screen.getByRole('cell')).toHaveClass('iu:text-right')
    expect(screen.getAllByRole('rowgroup')[1]).toHaveClass('iu:text-xs')
    expect(screen.getAllByRole('row')[0]).toHaveClass('iu:h-12')
    expect(screen.getAllByRole('rowgroup')[0]).toHaveClass('iu:bg-transparent')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderTable()
    expect(await axe(container)).toHaveNoViolations()
  })
})
