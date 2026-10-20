/// <reference types="uniwind/types" />

import { Linking, Text, type TextProps } from 'react-native'
import { cn } from '../../utils/cn'

export type LinkProps = Omit<TextProps, 'style' | 'onPress'> & {
  className?: string
  /** URL aberta com `Linking.openURL` ao tocar (depois de `onPress`). */
  href?: string
  /** Para navegar com o seu roteador, use só `onPress` (sem `href`). */
  onPress?: TextProps['onPress']
}

/** Link de texto na cor da marca, sempre sublinhado (a cor sozinha não distingue o link do texto). */
export function Link({ className, href, onPress, ...props }: LinkProps) {
  return (
    <Text
      accessibilityRole="link"
      onPress={(event) => {
        onPress?.(event)
        // URL inválida/sem app para abrir não deve virar rejeição não tratada
        if (href) Linking.openURL(href).catch(() => {})
      }}
      className={cn('text-text-brand underline active:text-interactive-primary-hover', className)}
      {...props}
    />
  )
}
