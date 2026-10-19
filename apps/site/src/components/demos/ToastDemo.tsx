import { Button, ToastProvider, useToast } from '@innovui/react'
import { Stage } from './Stage'

const row = { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' } as const

function Buttons() {
  const { toast } = useToast()

  return (
    <div style={row}>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            status: 'success',
            title: 'Pagamento aprovado',
            description: 'Seu pedido foi confirmado.',
          })
        }
      >
        Sucesso
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            status: 'error',
            title: 'Falha no envio',
            description: 'Não foi possível salvar. Tente novamente.',
          })
        }
      >
        Erro
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            status: 'neutral',
            description: 'Item removido da lista.',
            action: {
              label: 'Desfazer',
              onClick: () => toast({ status: 'success', description: 'Item restaurado.' }),
            },
          })
        }
      >
        Com ação
      </Button>
    </div>
  )
}

export function ToastDemo() {
  return (
    <Stage>
      <ToastProvider>
        <Buttons />
      </ToastProvider>
    </Stage>
  )
}
