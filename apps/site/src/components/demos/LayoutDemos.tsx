import {
  Avatar,
  Badge,
  Container,
  Grid,
  GridItem,
  List,
  ListItem,
  Pagination,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@innovui/react'
import { useState } from 'react'
import { Stage } from './Stage'

const box = {
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  background: 'var(--color-bg-tertiary)',
  color: 'var(--color-text-primary)',
  textAlign: 'center',
} as const

export function ContainerDemo() {
  return (
    <Stage>
      <Container size="sm" style={{ background: 'var(--color-bg-secondary)' }}>
        <div style={{ ...box, textAlign: 'left' }}>
          Conteúdo de largura máxima 640px, centralizado e com margem lateral.
        </div>
      </Container>
    </Stage>
  )
}

export function GridDemo() {
  return (
    <Stage>
      <Grid columns={12}>
        <GridItem span={12} style={box}>
          12
        </GridItem>
        <GridItem span={6} style={box}>
          6
        </GridItem>
        <GridItem span={6} style={box}>
          6
        </GridItem>
        <GridItem span={4} style={box}>
          4
        </GridItem>
        <GridItem span={4} style={box}>
          4
        </GridItem>
        <GridItem span={4} style={box}>
          4
        </GridItem>
      </Grid>
    </Stage>
  )
}

export function GridResponsiveDemo() {
  return (
    <Stage>
      <Grid>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
          <GridItem key={n} span={4} style={box}>
            {n}
          </GridItem>
        ))}
      </Grid>
    </Stage>
  )
}

export function ListDemo() {
  return (
    <Stage>
      <List divided style={{ maxWidth: 420 }}>
        <ListItem
          leading={<Avatar name="Camila Souza" src="/avatars/avatar-1.jpg" />}
          title="Camila Souza"
          description="Designer de produto"
          trailing={<Badge status="success">Ativa</Badge>}
        />
        <ListItem
          leading={<Avatar name="Rafael Lima" src="/avatars/avatar-2.jpg" />}
          title="Rafael Lima"
          description="Engenharia"
          trailing={<Badge status="pending">Convidado</Badge>}
        />
        <ListItem
          leading={<Avatar name="Yuki Tanaka" src="/avatars/avatar-3.jpg" />}
          title="Yuki Tanaka"
          description="Financeiro"
          trailing={<Badge status="neutral">Inativa</Badge>}
        />
      </List>
    </Stage>
  )
}

export function TableDemo() {
  return (
    <Stage>
      <Table>
        <TableCaption>Pedidos recentes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Status</TableHead>
            <TableHead style={{ textAlign: 'right' }}>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#1042</TableCell>
            <TableCell>Camila Souza</TableCell>
            <TableCell>
              <Badge status="success">Pago</Badge>
            </TableCell>
            <TableCell style={{ textAlign: 'right' }}>R$ 120,00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#1043</TableCell>
            <TableCell>Rafael Lima</TableCell>
            <TableCell>
              <Badge status="pending">Pendente</Badge>
            </TableCell>
            <TableCell style={{ textAlign: 'right' }}>R$ 89,90</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#1044</TableCell>
            <TableCell>Yuki Tanaka</TableCell>
            <TableCell>
              <Badge status="error">Recusado</Badge>
            </TableCell>
            <TableCell style={{ textAlign: 'right' }}>R$ 310,00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stage>
  )
}

export function PaginationDemo() {
  const [page, setPage] = useState(1)
  return (
    <Stage>
      <Pagination page={page} pageCount={20} onPageChange={setPage} />
    </Stage>
  )
}

export function PaginationShortDemo() {
  const [page, setPage] = useState(2)
  return (
    <Stage>
      <Pagination page={page} pageCount={5} onPageChange={setPage} />
    </Stage>
  )
}
