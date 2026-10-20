/// <reference types="uniwind/types" />

import { Pressable } from 'react-native'
import { useUniwind } from 'uniwind'
import { overlayOpacity } from '../../tokens/generated'

/**
 * Fundo escurecido de Modal e Drawer: `surface/overlay` na opacidade do tema (50% no claro, 70% no
 * escuro). Sem blur (o React Native não tem backdrop-filter sem dependência nativa extra).
 * Toque no fundo chama `onPress`.
 */
export function Backdrop({ onPress, testID }: { onPress?: () => void; testID?: string }) {
  const { theme } = useUniwind()
  const opacity = theme === 'dark' ? overlayOpacity.dark : overlayOpacity.light
  return (
    <Pressable
      accessible={false}
      testID={testID}
      onPress={onPress}
      className="absolute inset-0 bg-surface-overlay"
      style={{ opacity }}
    />
  )
}
