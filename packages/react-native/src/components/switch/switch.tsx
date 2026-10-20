/// <reference types="uniwind/types" />

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Animated, Pressable, type PressableProps, Text, View } from 'react-native'
import { cn } from '../../utils/cn'

export type SwitchProps = Omit<PressableProps, 'children' | 'style' | 'onPress'> & {
  className?: string
  label?: ReactNode
  /** Controlado. Sem ele, o componente guarda o próprio estado (começa em `defaultChecked`). */
  checked?: boolean
  defaultChecked?: boolean
  /** Chamado com o novo valor a cada toque, com efeito imediato (sem submit). */
  onCheckedChange?: (checked: boolean) => void
}

// Trilho de 44x24 e polegar de 20 com 2 de folga: curso de 20px.
const TRAVEL = 20

export function Switch({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  className,
  accessibilityState,
  ...props
}: SwitchProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked)
  const isChecked = checked ?? uncontrolled
  const isDisabled = Boolean(disabled)
  const position = useRef(new Animated.Value(isChecked ? TRAVEL : 0)).current

  useEffect(() => {
    Animated.timing(position, {
      toValue: isChecked ? TRAVEL : 0,
      duration: 150,
      useNativeDriver: true,
    }).start()
  }, [isChecked, position])

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ ...accessibilityState, checked: isChecked, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => {
        setUncontrolled(!isChecked)
        onCheckedChange?.(!isChecked)
      }}
      className={cn('min-h-11 flex-row items-center gap-2.5 self-start', className)}
      {...props}
    >
      <View
        className={cn(
          'h-6 w-11 justify-center rounded-full bg-selection-toggle-track-off',
          isChecked && 'bg-selection-bg-selected',
          isDisabled && 'bg-selection-bg-disabled',
        )}
      >
        <Animated.View style={{ marginLeft: 2, transform: [{ translateX: position }] }}>
          <View className="size-5 rounded-full bg-selection-indicator-selected" />
        </Animated.View>
      </View>
      {typeof label === 'string' ? (
        <Text
          className={cn(
            'text-sm font-medium text-selection-text-label',
            isDisabled && 'text-selection-text-disabled',
          )}
        >
          {label}
        </Text>
      ) : (
        label
      )}
    </Pressable>
  )
}
