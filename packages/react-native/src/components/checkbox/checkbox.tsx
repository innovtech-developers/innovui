/// <reference types="uniwind/types" />

import { type ReactNode, useState } from 'react'
import { Pressable, type PressableProps, Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { cn } from '../../utils/cn'
import { useToken } from '../_shared/use-token'

export type CheckboxProps = Omit<PressableProps, 'children' | 'style' | 'onPress'> & {
  className?: string
  label?: ReactNode
  /** Controlado. Sem ele, o componente guarda o próprio estado (começa em `defaultChecked`). */
  checked?: boolean
  defaultChecked?: boolean
  /** Chamado com o novo valor a cada toque. */
  onCheckedChange?: (checked: boolean) => void
  /** Seleção parcial: aparece com o traço e é anunciada como "misto". */
  indeterminate?: boolean
  error?: boolean
}

export function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  indeterminate = false,
  error,
  disabled,
  className,
  accessibilityState,
  ...props
}: CheckboxProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked)
  const isChecked = checked ?? uncontrolled
  const isDisabled = Boolean(disabled)
  const filled = isChecked || indeterminate
  const indicator = useToken('--color-selection-indicator-selected')

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{
        ...accessibilityState,
        checked: indeterminate ? 'mixed' : isChecked,
        disabled: isDisabled,
      }}
      disabled={isDisabled}
      onPress={() => {
        // Em indeterminate, o toque marca (como no input nativo).
        const next = indeterminate ? true : !isChecked
        setUncontrolled(next)
        onCheckedChange?.(next)
      }}
      className={cn('min-h-11 flex-row items-center gap-3 self-start', className)}
      {...props}
    >
      <View
        className={cn(
          'size-5 items-center justify-center rounded border-2 border-selection-border-unselected bg-selection-bg-unselected',
          filled && 'border-selection-border-selected bg-selection-bg-selected',
          isDisabled && 'border-selection-border-disabled bg-selection-bg-disabled',
          error && 'border-status-error-border',
        )}
      >
        {indeterminate ? (
          <Svg width={14} height={14} viewBox="0 0 16 16">
            <Path
              d="M3 8h10"
              stroke={indicator}
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        ) : isChecked ? (
          <Svg width={14} height={14} viewBox="0 0 16 16">
            <Path
              d="M3 8.5 6.5 12 13 4.5"
              stroke={indicator}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
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
