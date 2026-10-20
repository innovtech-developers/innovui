import {
  Accordion,
  AccordionItem,
  Button,
  Drawer,
  DrawerClose,
  Menu,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  Popover,
  PopoverClose,
  Stack,
} from '@innovui/react'
import { useState } from 'react'
import { Stage } from './Stage'

const row = { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' } as const

const icon = (d: string) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
)
const pencil = icon('M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z')
const copy = icon('M9 9h11v11H9zM5 15V5h10')
const trash = icon('M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6')

export function PopoverDemo() {
  return (
    <Stage>
      <Popover label="Filtros" trigger={<Button variant="secondary">Filtros</Button>}>
        <Stack gap={3}>
          <strong>Status do pedido</strong>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Mostre só os pedidos pagos, pendentes ou recusados.
          </span>
          <PopoverClose asChild>
            <Button size="sm">Aplicar</Button>
          </PopoverClose>
        </Stack>
      </Popover>
    </Stage>
  )
}

export function MenuDemo() {
  const [last, setLast] = useState('nenhuma')
  return (
    <Stage>
      <div style={row}>
        <Menu trigger={<Button variant="secondary">Ações</Button>}>
          <MenuLabel>Pedido #1042</MenuLabel>
          <MenuItem icon={pencil} onSelect={() => setLast('Editar')}>
            Editar
          </MenuItem>
          <MenuItem icon={copy} onSelect={() => setLast('Duplicar')}>
            Duplicar
          </MenuItem>
          <MenuItem icon={copy} disabled>
            Arquivar
          </MenuItem>
          <MenuSeparator />
          <MenuItem icon={trash} destructive onSelect={() => setLast('Excluir')}>
            Excluir
          </MenuItem>
        </Menu>
        <span style={{ color: 'var(--color-text-secondary)' }}>Última ação: {last}</span>
      </div>
    </Stage>
  )
}

export function DrawerDemo() {
  return (
    <Stage>
      <Drawer
        title="Detalhes do pedido"
        trigger={<Button variant="secondary">Abrir painel</Button>}
        footer={
          <>
            <DrawerClose asChild>
              <Button variant="ghost">Fechar</Button>
            </DrawerClose>
            <Button>Reenviar</Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>Pedido #1042, pago por Pix em 12/10.</p>
        <p style={{ margin: 0 }}>Entrega prevista em 3 dias úteis.</p>
      </Drawer>
    </Stage>
  )
}

export function DrawerSidesDemo() {
  return (
    <Stage>
      <div style={row}>
        {(['right', 'left', 'top', 'bottom'] as const).map((side) => (
          <Drawer
            key={side}
            side={side}
            title={`Painel: ${side}`}
            trigger={<Button variant="secondary">{side}</Button>}
          >
            O painel gruda na borda {side}.
          </Drawer>
        ))}
      </div>
    </Stage>
  )
}

export function AccordionDemo() {
  return (
    <Stage>
      <Accordion type="single" collapsible defaultValue="pagamento" style={{ maxWidth: 480 }}>
        <AccordionItem value="pagamento" title="Quais formas de pagamento?">
          Aceitamos cartão de crédito, boleto e Pix.
        </AccordionItem>
        <AccordionItem value="entrega" title="Qual o prazo de entrega?">
          De 3 a 7 dias úteis, conforme o CEP.
        </AccordionItem>
        <AccordionItem value="troca" title="Posso trocar o produto?" disabled>
          Em até 30 dias.
        </AccordionItem>
      </Accordion>
    </Stage>
  )
}

export function AccordionMultipleDemo() {
  return (
    <Stage>
      <Accordion type="multiple" style={{ maxWidth: 480 }}>
        <AccordionItem value="a" title="Conta">
          Dados de perfil e e-mail.
        </AccordionItem>
        <AccordionItem value="b" title="Segurança">
          Senha e verificação em duas etapas.
        </AccordionItem>
        <AccordionItem value="c" title="Cobrança">
          Cartões e notas fiscais.
        </AccordionItem>
      </Accordion>
    </Stage>
  )
}
