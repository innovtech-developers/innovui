import {
  Button,
  Drawer,
  Menu,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  Modal,
  ModalClose,
  Popover,
  Tooltip,
  useToast,
} from '@innovui/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Body, Section } from './section'

export function Overlays() {
  const { toast } = useToast()
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)

  return (
    <Section title="Overlays">
      <View className="items-start gap-3">
        <Button variant="secondary" onPress={() => setModal(true)}>
          Abrir modal
        </Button>
        <Button variant="secondary" onPress={() => setDrawer(true)}>
          Abrir drawer
        </Button>
        <Popover label="Detalhes" trigger={<Button variant="tertiary">Popover</Button>}>
          <Body>Conteúdo do popover</Body>
        </Popover>
        <Menu trigger={<Button variant="tertiary">Menu</Button>}>
          <MenuLabel>Conta</MenuLabel>
          <MenuItem onSelect={() => toast({ title: 'Perfil', description: 'Abrindo perfil' })}>
            Perfil
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            onSelect={() => toast({ title: 'Saiu', description: 'Até logo', status: 'info' })}
          >
            Sair
          </MenuItem>
        </Menu>
        <Tooltip content="Mantenha pressionado">
          <Button variant="ghost">Tooltip (segure)</Button>
        </Tooltip>
        <Button
          variant="ghost"
          onPress={() =>
            toast({ title: 'Tudo certo', description: 'Toast de exemplo', status: 'success' })
          }
        >
          Mostrar toast
        </Button>
      </View>

      <Modal open={modal} onOpenChange={setModal} title="Confirmar">
        <Body>Tem certeza?</Body>
        <ModalClose>
          <Button className="mt-4">Fechar</Button>
        </ModalClose>
      </Modal>
      <Drawer open={drawer} onOpenChange={setDrawer} title="Filtros">
        <Body>Conteúdo do drawer</Body>
      </Drawer>
    </Section>
  )
}
