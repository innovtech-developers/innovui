import { Button, IconButton, Link, Spinner } from '@innovui/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { useCSSVariable } from 'uniwind'
import { Section } from './section'

const variants = ['primary', 'secondary', 'tertiary', 'ghost', 'destructive'] as const
const sizes = ['lg', 'md', 'sm'] as const

function PlusIcon() {
  const color = useCSSVariable('--color-button-ghost-text')
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      stroke={String(color)}
      strokeWidth={2}
    >
      <Path d="M10 4v12M4 10h12" strokeLinecap="round" />
    </Svg>
  )
}

export function Actions() {
  const [loading, setLoading] = useState(false)
  return (
    <>
      <Section title="Button: variantes">
        <View className="items-start gap-3">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </View>
      </Section>
      <Section title="Button: tamanhos e desabilitado">
        <View className="items-start gap-3">
          {sizes.map((size) => (
            <Button key={size} size={size}>
              {`Tamanho ${size}`}
            </Button>
          ))}
          <Button disabled>Desabilitado</Button>
          <Button
            loading={loading}
            onPress={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 2000)
            }}
          >
            Toque para carregar
          </Button>
        </View>
      </Section>
      <Section title="IconButton, Link, Spinner">
        <View className="flex-row items-center gap-4">
          <IconButton accessibilityLabel="Adicionar" variant="secondary">
            <PlusIcon />
          </IconButton>
          <Link href="https://innovui.com.br">Link externo</Link>
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
        </View>
      </Section>
    </>
  )
}
