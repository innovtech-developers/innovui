/// <reference types="uniwind/types" />

import { type ReactNode, useState } from 'react'
import { Pressable, type PressableProps, Text, View } from 'react-native'
import { cn } from '../../utils/cn'

export type RadioProps = Omit<PressableProps, 'children' | 'style' | 'onPress'> & {
  className?: string
  label?: ReactNode
  /** Controlado. No native não há `name`: para formar um grupo, controle `checked` de cada opção. */
  checked?: boolean
  defaultChecked?: boolean
  /** Chamado com `true` ao selecionar; tocar numa opção já marcada não faz nada. */
  onCheckedChange?: (checked: boolean) => void
  error?: boolean
}

export function Radio({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  error,
  disabled,
  className,
  accessibilityState,
  ...props
}: RadioProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked)
  const isChecked = checked ?? uncontrolled
  const isDisabled = Boolean(disabled)

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ ...accessibilityState, checked: isChecked, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => {
        if (isChecked) return
        setUncontrolled(true)
        onCheckedChange?.(true)
      }}
      className={cn('min-h-11 flex-row items-center gap-3 self-start', className)}
      {...props}
    >
      <View
        className={cn(
          'size-5 items-center justify-center rounded-full border-2 border-selection-border-unselected bg-selection-bg-unselected',
          isChecked && 'border-selection-border-selected bg-selection-bg-selected',
          isDisabled && 'border-selection-border-disabled bg-selection-bg-disabled',
          error && 'border-status-error-border',
        )}
      >
        {isChecked ? (
          <View
            className={cn(
              'size-2.5 rounded-full bg-selection-indicator-selected',
              isDisabled && 'bg-selection-text-disabled',
            )}
          />
        ) : null}
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
