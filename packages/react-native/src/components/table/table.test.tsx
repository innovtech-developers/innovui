import { render, screen } from '@testing-library/react-native'
import { ScrollView, Text } from 'react-native'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

function Example() {
  return (
    <Table testID="table">
      <TableCaption>Faturas recentes</TableCaption>
      <TableHeader testID="header">
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody testID="body">
        <TableRow testID="row">
          <TableCell testID="cell">Ana</TableCell>
          <TableCell>
            <Text>R$ 10</Text>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe('Table', () => {
  it('renderiza as partes e o conteúdo', () => {
    render(<Example />)
    expect(screen.getByText('Faturas recentes')).toBeTruthy()
    expect(screen.getByText('Cliente')).toBeTruthy()
    expect(screen.getByText('Ana')).toBeTruthy()
    expect(screen.getByText('R$ 10')).toBeTruthy()
  })

  it('é uma grade que rola na horizontal', () => {
    render(<Example />)
    expect(screen.getByTestId('table').props.role).toBe('grid')
    expect(screen.UNSAFE_getByType(ScrollView).props.horizontal).toBe(true)
  })

  it('cabeçalhos são header e têm o estilo de cabeçalho', () => {
    render(<Example />)
    expect(screen.getAllByRole('header')).toHaveLength(2)
    expect(screen.getByText('Cliente').props.className).toContain('text-text-secondary')
    expect(screen.getByTestId('header').props.className).toContain('bg-bg-secondary')
  })

  it('linhas têm borda e as células dividem a largura', () => {
    render(<Example />)
    expect(screen.getByTestId('row').props.className).toContain('border-border-default')
    expect(screen.getByTestId('row').props.className).toContain('flex-row')
    expect(screen.getByTestId('cell').props.className).toContain('flex-1')
    expect(screen.getByText('Ana').props.className).toContain('text-text-primary')
  })

  it('className do consumidor vence o padrão', () => {
    render(
      <Table testID="t" className="min-w-0">
        <TableRow testID="r" className="border-0">
          <TableCell testID="c" className="px-2">
            x
          </TableCell>
        </TableRow>
      </Table>,
    )
    expect(screen.getByTestId('t').props.className).toBe('min-w-0')
    expect(screen.getByTestId('r').props.className.split(' ')).not.toContain('border-b')
    expect(screen.getByTestId('c').props.className).toContain('px-2')
    expect(screen.getByTestId('c').props.className).not.toContain('px-4')
  })
})
