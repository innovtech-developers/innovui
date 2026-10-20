/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { TextInput, type TextInputProps, View } from 'react-native'
import { cn } from '../../utils/cn'
import { useToken } from '../_shared/use-token'

/** Estilo do campo, compartilhado com o Textarea (não faz parte da API pública). */
export const inputVariants = cva(
  'w-full rounded-md border border-field-border bg-field-bg py-0 text-field-text focus:border-field-focus-ring',
  {
    variants: {
      size: {
        lg: 'h-14 px-4 text-base',
        md: 'h-12 px-3 text-base',
        sm: 'h-10 px-2 text-sm',
      },
      error: {
        true: 'border-field-border-error focus:border-field-border-error',
        false: '',
      },
    },
    defaultVariants: { size: 'md', error: false },
  },
)

// Posição do ícone e recuo do texto por tamanho (Figma: padding + ícone 24/20/24 + gap 8/8/4).
const iconSlot = {
  lg: { icon: 'w-5', left: 'left-4', right: 'right-4', padL: 'pl-11', padR: 'pr-11' },
  md: { icon: 'w-6', left: 'left-3', right: 'right-3', padL: 'pl-11', padR: 'pr-11' },
  sm: { icon: 'w-6', left: 'left-2', right: 'right-2', padL: 'pl-9', padR: 'pr-9' },
}

export type InputProps = Omit<TextInputProps, 'style' | 'editable'> &
  Omit<VariantProps<typeof inputVariants>, 'error'> & {
    className?: string
    /** Borda e foco em vermelho. */
    error?: boolean
    disabled?: boolean
    /** Ícone antes do texto (o consumidor define a cor; o slot tem 24px). */
    leadingIcon?: ReactNode
    /** Ícone depois do texto (o consumidor define a cor; o slot tem 24px). */
    trailingIcon?: ReactNode
  }

export function Input({
  className,
  size,
  error = false,
  disabled = false,
  readOnly = false,
  leadingIcon,
  trailingIcon,
  accessibilityState,
  ...props
}: InputProps) {
  const placeholderColor = useToken('--color-field-text-placeholder')
  const slot = iconSlot[size ?? 'md']

  const input = (
    <TextInput
      editable={!disabled && !readOnly}
      readOnly={readOnly}
      placeholderTextColor={placeholderColor}
      accessibilityState={{ ...accessibilityState, disabled }}
      className={cn(
        inputVariants({ size, error }),
        disabled &&
          'border-field-border-disabled bg-field-bg-disabled text-field-text-disabled focus:border-field-border-disabled',
        readOnly && !disabled && 'border-transparent bg-field-bg-disabled focus:border-transparent',
        leadingIcon && slot.padL,
        trailingIcon && slot.padR,
        className,
      )}
      {...props}
    />
  )

  if (!leadingIcon && !trailingIcon) return input

  return (
    <View className="justify-center">
      {leadingIcon ? (
        <View
          pointerEvents="none"
          className={cn(
            'absolute inset-y-0 z-10 items-center justify-center',
            slot.icon,
            slot.left,
          )}
        >
          {leadingIcon}
        </View>
      ) : null}
      {input}
      {trailingIcon ? (
        <View
          pointerEvents="none"
          className={cn(
            'absolute inset-y-0 z-10 items-center justify-center',
            slot.icon,
            slot.right,
          )}
        >
          {trailingIcon}
        </View>
      ) : null}
    </View>
  )
}
