import { Button } from '@innovui/react'
import { useState } from 'react'
import { Stage } from './Stage'

export function ButtonVariantsDemo() {
  return (
    <Stage>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </Stage>
  )
}

export function ButtonSizesDemo() {
  return (
    <Stage>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </Stage>
  )
}

export function ButtonLoadingDemo() {
  const [loading, setLoading] = useState(false)

  return (
    <Stage>
      <Button
        loading={loading}
        onClick={() => {
          setLoading(true)
          setTimeout(() => setLoading(false), 2000)
        }}
      >
        {loading ? 'Salvando…' : 'Salvar alterações'}
      </Button>
    </Stage>
  )
}
