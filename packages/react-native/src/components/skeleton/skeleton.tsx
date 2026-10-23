/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

// Dimensões padrão do Figma; sobrescreva com className (ex.: `w-full`) para casar com o conteúdo real.
const skeletonVariants = cva('overflow-hidden', {
  variants: {
    variant: {
      text: 'h-3 w-[200px] rounded-sm',
      title: 'h-5 w-[160px] rounded-sm',
      avatar: 'size-10 rounded-full',
      card: 'h-[120px] w-[300px] rounded-[8px]',
      rectangle: 'h-6 w-[200px] rounded-[8px]',
    },
  },
  defaultVariants: { variant: 'text' },
})

export type SkeletonProps = Omit<ViewProps, 'children'> &
  VariantProps<typeof skeletonVariants> & {
    className?: string
  }

/**
 * Placeholder de conteúdo em carregamento. É decorativo (escondido do leitor de tela): anuncie o
 * carregamento no contêiner, com `accessibilityState={{ busy: true }}`. Para ações pontuais, use
 * Spinner. Não respeita "reduzir movimento" (a web faz via `motion-reduce`).
 */
export function Skeleton({ className, variant, ...props }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [opacity])

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    >
      {/* O Animated não recebe className: só pulsa; o visual fica no View de dentro. */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
        <View className="size-full bg-bg-skeleton" />
      </Animated.View>
    </View>
  )
}
