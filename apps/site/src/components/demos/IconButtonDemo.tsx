import { IconButton } from '@innovui/react'
import { useState } from 'react'
import { Stage } from './Stage'

// Ícone de exemplo (traço do Lucide "x"); o tamanho vem do IconButton.
const Close = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const row = { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' } as const

export function IconButtonVariantsDemo() {
  return (
    <Stage>
      <div style={row}>
        <IconButton aria-label="Fechar" variant="primary">
          <Close />
        </IconButton>
        <IconButton aria-label="Fechar" variant="secondary">
          <Close />
        </IconButton>
        <IconButton aria-label="Fechar" variant="tertiary">
          <Close />
        </IconButton>
        <IconButton aria-label="Fechar" variant="ghost">
          <Close />
        </IconButton>
        <IconButton aria-label="Fechar" variant="destructive">
          <Close />
        </IconButton>
      </div>
    </Stage>
  )
}

export function IconButtonSizesDemo() {
  return (
    <Stage>
      <div style={row}>
        <IconButton aria-label="Fechar" size="sm">
          <Close />
        </IconButton>
        <IconButton aria-label="Fechar" size="md">
          <Close />
        </IconButton>
        <IconButton aria-label="Fechar" size="lg">
          <Close />
        </IconButton>
      </div>
    </Stage>
  )
}

export function IconButtonLoadingDemo() {
  const [loading, setLoading] = useState(false)

  return (
    <Stage>
      <IconButton
        aria-label="Fechar"
        loading={loading}
        onClick={() => {
          setLoading(true)
          setTimeout(() => setLoading(false), 2000)
        }}
      >
        <Close />
      </IconButton>
    </Stage>
  )
}
