/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

const spinnerVariants = cva('shrink-0', {
  variants: {
    size: {
      lg: 'size-6', // 24px
      md: 'size-5', // 20px
      sm: 'size-4', // 16px
    },
  },
  defaultVariants: { size: 'md' },
})

export type SpinnerProps = Omit<ViewProps, 'children'> &
  VariantProps<typeof spinnerVariants> & {
    className?: string
  }

/** Indicador indeterminado. Para carregamento de tela/seção, prefira um Skeleton. */
export function Spinner({
  className,
  size,
  accessibilityLabel = 'Carregando',
  ...props
}: SpinnerProps) {
  const rotation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )
    loop.start()
    return () => loop.stop()
  }, [rotation])

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <View className="absolute inset-0 rounded-full border-2 border-spinner-track opacity-30" />
      {/* O Animated não recebe className: só gira; o visual fica no View de dentro. */}
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate }] }]}>
        <View className="size-full rounded-full border-2 border-transparent border-t-spinner-indicator" />
      </Animated.View>
    </View>
  )
}
