import { Avatar, Card, Divider, Link, Stack } from '@innovui/react'
import { Stage } from './Stage'

const row = { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' } as const

export function CardDemo() {
  return (
    <Stage>
      <Card style={{ maxWidth: 320 }}>
        <Stack gap={2}>
          <strong>Plano Pro</strong>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Até 10 usuários, suporte por e-mail e relatórios mensais.
          </span>
        </Stack>
      </Card>
    </Stage>
  )
}

export function AvatarDemo() {
  return (
    <Stage>
      <div style={row}>
        <Avatar name="Camila Souza" src="/avatars/avatar-1.jpg" size="sm" />
        <Avatar name="Rafael Lima" src="/avatars/avatar-2.jpg" />
        <Avatar name="Yuki Tanaka" src="/avatars/avatar-3.jpg" size="lg" />
        <Avatar name="Bianca Alves" src="/avatars/avatar-4.jpg" />
        <Avatar name="Diego Martins" src="/avatars/avatar-5.jpg" />
        <Avatar name="Helena Costa" src="/avatars/avatar-6.jpg" />
      </div>
    </Stage>
  )
}

export function AvatarFallbackDemo() {
  return (
    <Stage>
      <div style={row}>
        <Avatar name="Ada Lovelace" size="sm" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Margaret Hamilton" size="lg" />
        <Avatar name="Katherine Johnson" src="/nao-existe.png" />
      </div>
    </Stage>
  )
}

export function DividerDemo() {
  return (
    <Stage>
      <Stack gap={3} style={{ maxWidth: 320 }}>
        <span>Conta</span>
        <Divider />
        <div style={{ ...row, height: '1.5rem' }}>
          <span>Perfil</span>
          <Divider orientation="vertical" />
          <span>Segurança</span>
          <Divider orientation="vertical" />
          <span>Cobrança</span>
        </div>
      </Stack>
    </Stage>
  )
}

export function LinkDemo() {
  return (
    <Stage>
      <p style={{ margin: 0 }}>
        Leia a <Link href="/react/instalacao/">instalação</Link> ou veja o{' '}
        <Link
          href="https://github.com/innovtech-developers/innovui"
          target="_blank"
          rel="noreferrer"
        >
          código no GitHub
        </Link>
        .
      </p>
    </Stage>
  )
}

const box = {
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  background: 'var(--color-bg-tertiary)',
  color: 'var(--color-text-primary)',
} as const

export function StackDemo() {
  return (
    <Stage>
      <Stack gap={4}>
        <Stack direction="row" gap={2}>
          <div style={box}>1</div>
          <div style={box}>2</div>
          <div style={box}>3</div>
        </Stack>
        <Stack direction="row" gap={3} align="center" justify="between" style={{ maxWidth: 384 }}>
          <div style={box}>Esquerda</div>
          <div style={box}>Direita</div>
        </Stack>
      </Stack>
    </Stage>
  )
}
