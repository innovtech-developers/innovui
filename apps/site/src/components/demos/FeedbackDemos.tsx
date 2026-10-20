import { Alert, Badge, Banner, Button, Skeleton, Tag } from '@innovui/react'
import { Fragment, useState } from 'react'
import { Stage } from './Stage'

const row = { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' } as const

export function BadgeDemo() {
  return (
    <Stage>
      <div style={row}>
        <Badge status="success">Pago</Badge>
        <Badge status="error">Recusado</Badge>
        <Badge status="warning">Atenção</Badge>
        <Badge status="info">Novo</Badge>
        <Badge status="neutral">Rascunho</Badge>
        <Badge status="pending">Pendente</Badge>
      </div>
    </Stage>
  )
}

export function BadgeDotDemo() {
  return (
    <Stage>
      <div style={row}>
        <Badge status="success" dot>
          Ativo
        </Badge>
        <Badge status="error" dot>
          Offline
        </Badge>
        <Badge status="pending" dot>
          Em análise
        </Badge>
      </div>
    </Stage>
  )
}

export function TagDemo() {
  return (
    <Stage>
      <div style={row}>
        <Tag>Design</Tag>
        <Tag variant="outline">Código</Tag>
      </div>
    </Stage>
  )
}

export function TagDismissDemo() {
  const [tags, setTags] = useState(['React', 'Acessibilidade', 'Tokens'])

  return (
    <Stage>
      <div style={row}>
        {tags.map((tag) => (
          <Tag
            key={tag}
            onDismiss={() => setTags(tags.filter((t) => t !== tag))}
            dismissLabel={`Remover ${tag}`}
          >
            {tag}
          </Tag>
        ))}
        {tags.length === 0 && <span>Todas as tags foram removidas.</span>}
      </div>
    </Stage>
  )
}

const stack = { display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' } as const

export function AlertDemo() {
  return (
    <Stage>
      <div style={stack}>
        <Alert status="success" title="Pagamento aprovado">
          Seu pedido foi confirmado.
        </Alert>
        <Alert status="error" title="Falha no envio">
          Não foi possível salvar. Tente novamente.
        </Alert>
        <Alert status="warning" title="Atenção">
          Sua assinatura vence em 3 dias.
        </Alert>
        <Alert status="info" title="Novidade">
          Agora você pode exportar relatórios em PDF.
        </Alert>
        <Alert status="neutral" title="Dica">
          Use atalhos de teclado para navegar mais rápido.
        </Alert>
      </div>
    </Stage>
  )
}

export function AlertActionDemo() {
  const [open, setOpen] = useState(true)

  return (
    <Stage>
      {open ? (
        <Alert
          status="warning"
          title="Alterações não salvas"
          action={
            <Button variant="ghost" size="sm">
              Salvar agora
            </Button>
          }
          onDismiss={() => setOpen(false)}
        >
          Você tem edições pendentes neste formulário.
        </Alert>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          Mostrar alerta de novo
        </Button>
      )}
    </Stage>
  )
}

export function BannerDemo() {
  const [open, setOpen] = useState(true)

  return (
    <Stage>
      <div style={stack}>
        {open && (
          <Banner
            status="info"
            action={
              <Button variant="ghost" size="sm">
                Saiba mais
              </Button>
            }
            onDismiss={() => setOpen(false)}
          >
            Manutenção programada hoje às 22h. O sistema ficará indisponível por 30 minutos.
          </Banner>
        )}
        <Banner status="success">Sua conta foi verificada com sucesso.</Banner>
        <Banner status="error">Estamos com instabilidade nos pagamentos.</Banner>
        <Banner status="warning">Seu período de teste termina amanhã.</Banner>
        <Banner status="neutral">Versão 2.1 disponível.</Banner>
      </div>
    </Stage>
  )
}

const SKELETON_VARIANTS = ['text', 'title', 'avatar', 'rectangle', 'card'] as const

export function SkeletonVariantsDemo() {
  return (
    <Stage>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'max-content 1fr',
          alignItems: 'center',
          columnGap: '1.5rem',
          rowGap: '1rem',
        }}
      >
        {SKELETON_VARIANTS.map((variant) => (
          <Fragment key={variant}>
            <code style={{ fontSize: '0.8125rem' }}>{variant}</code>
            <Skeleton variant={variant} />
          </Fragment>
        ))}
      </div>
    </Stage>
  )
}

export function SkeletonLoadingDemo() {
  const [loading, setLoading] = useState(true)

  return (
    <Stage>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: 360,
        }}
      >
        <div aria-busy={loading} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {loading ? (
            <>
              <Skeleton variant="avatar" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <Skeleton variant="title" className="iu:w-3/5" />
                <Skeleton className="iu:w-full" />
              </div>
            </>
          ) : (
            <>
              <Badge status="success">LB</Badge>
              <div>
                <strong>Lucas Bogos</strong>
                <div>Design System · InnovUI</div>
              </div>
            </>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={() => setLoading(!loading)}>
          {loading ? 'Carregar conteúdo' : 'Voltar ao carregamento'}
        </Button>
      </div>
    </Stage>
  )
}
