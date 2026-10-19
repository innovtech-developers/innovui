import { Badge, Tag } from '@innovui/react'
import { useState } from 'react'
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
