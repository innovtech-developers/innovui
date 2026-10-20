/// <reference types="uniwind/types" />

import { cva } from 'class-variance-authority'
import type { ReactNode, RefObject } from 'react'
import { Pressable, Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { cn } from '../../utils/cn'
import { ChevronRightIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'

export type FieldSize = 'sm' | 'md' | 'lg'

const triggerVariants = cva(
  'w-full flex-row items-center justify-between gap-2 rounded-md border',
  {
    variants: {
      size: {
        lg: 'h-14 px-4',
        md: 'h-12 px-3',
        sm: 'h-10 px-2',
      },
      state: {
        idle: 'border-field-border bg-field-bg',
        open: 'border-field-focus-ring bg-field-bg',
        error: 'border-field-border-error bg-field-bg',
        disabled: 'border-field-border-disabled bg-field-bg-disabled',
        readOnly: 'border-transparent bg-field-bg-disabled',
      },
    },
    defaultVariants: { size: 'md', state: 'idle' },
  },
)

const textVariants = cva('flex-1 text-base', {
  variants: {
    tone: {
      value: 'text-field-text',
      placeholder: 'text-field-text-placeholder',
      disabled: 'text-field-text-disabled',
    },
  },
})

export type FieldTriggerProps = {
  /** Âncora medida por `useAnchor` (a View que envolve o gatilho). */
  anchorRef?: RefObject<View>
  /** Texto do valor; sem ele, mostra o placeholder. */
  text?: ReactNode
  placeholder: string
  icon: 'chevron' | 'calendar'
  size?: FieldSize
  error?: boolean
  open?: boolean
  disabled?: boolean
  readOnly?: boolean
  onPress?: () => void
  className?: string
  accessibilityLabel?: string
  accessibilityHint?: string
  testID?: string
}

function CalendarIcon({ color }: { color?: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
      />
    </Svg>
  )
}

/**
 * Gatilho com visual de Input para Select, Combobox, DatePicker e DateRangePicker (uso interno,
 * não faz parte da API pública). Sem hover/focus-visible no native: o estado aberto usa a cor do
 * anel de foco na borda.
 */
export function FieldTrigger({
  anchorRef,
  text,
  placeholder,
  icon,
  size,
  error,
  open,
  disabled,
  readOnly,
  onPress,
  className,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: FieldTriggerProps) {
  const iconColor = useToken('--color-field-text-placeholder')
  const hasText = text !== undefined && text !== null && text !== ''
  const state = disabled
    ? 'disabled'
    : readOnly
      ? 'readOnly'
      : open
        ? 'open'
        : error
          ? 'error'
          : 'idle'

  return (
    <View ref={anchorRef} collapsable={false} className="w-full">
      <Pressable
        accessibilityRole="combobox"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ expanded: Boolean(open), disabled: Boolean(disabled) }}
        disabled={disabled}
        onPress={readOnly ? undefined : onPress}
        testID={testID}
        className={cn(triggerVariants({ size, state }), className)}
      >
        <Text
          numberOfLines={1}
          className={textVariants({
            tone: disabled ? 'disabled' : hasText ? 'value' : 'placeholder',
          })}
        >
          {hasText ? text : placeholder}
        </Text>
        {icon === 'calendar' ? (
          <CalendarIcon color={iconColor} />
        ) : (
          <View className={open ? '-rotate-90' : 'rotate-90'}>
            <ChevronRightIcon color={iconColor} />
          </View>
        )}
      </Pressable>
    </View>
  )
}
