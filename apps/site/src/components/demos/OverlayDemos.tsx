import { Button, IconButton, Modal, ModalClose, Tooltip } from '@innovui/react'
import { useState } from 'react'
import { Stage } from './Stage'

const row = { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' } as const

const Info = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
)

export function TooltipDemo() {
  return (
    <Stage>
      <div style={{ ...row, padding: '2rem 0' }}>
        <Tooltip content="Abre as configurações" side="top">
          <Button variant="secondary">Topo</Button>
        </Tooltip>
        <Tooltip content="Abre as configurações" side="bottom">
          <Button variant="secondary">Baixo</Button>
        </Tooltip>
        <Tooltip content="Abre as configurações" side="left">
          <Button variant="secondary">Esquerda</Button>
        </Tooltip>
        <Tooltip content="Abre as configurações" side="right">
          <Button variant="secondary">Direita</Button>
        </Tooltip>
      </div>
    </Stage>
  )
}

export function TooltipTitleDemo() {
  return (
    <Stage>
      <div style={row}>
        <Tooltip title="Salvar" content="Atalho: Ctrl + S">
          <Button>Salvar</Button>
        </Tooltip>
        <Tooltip content="Mais informações sobre este campo">
          <IconButton aria-label="Ajuda" variant="ghost">
            <Info />
          </IconButton>
        </Tooltip>
      </div>
    </Stage>
  )
}

export function ModalDemo() {
  return (
    <Stage>
      <Modal
        title="Excluir projeto"
        trigger={<Button>Abrir modal</Button>}
        footer={
          <>
            <ModalClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </ModalClose>
            <ModalClose asChild>
              <Button variant="destructive">Excluir</Button>
            </ModalClose>
          </>
        }
      >
        Tem certeza de que quer excluir este projeto? Todos os arquivos serão removidos e esta ação
        não pode ser desfeita.
      </Modal>
    </Stage>
  )
}

export function ModalControlledDemo() {
  const [open, setOpen] = useState(false)

  return (
    <Stage>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Abrir modal médio
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        size="md"
        title="Convidar pessoas"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setOpen(false)}>Enviar convites</Button>
          </>
        }
      >
        <p>Controlado por estado: o modal abre e fecha pelo seu código.</p>
      </Modal>
    </Stage>
  )
}
