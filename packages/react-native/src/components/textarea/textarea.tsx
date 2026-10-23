/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import { TextInput, type TextInputProps } from 'react-native'
import { cn } from '../../utils/cn'
import { useToken } from '../_shared/use-token'

const textareaVariants = cva(
  'min-h-30 w-full rounded-[8px] border border-field-border bg-field-bg text-field-text focus:border-field-focus-ring',
  {
    variants: {
      size: {
        lg: 'p-4 text-base',
        md: 'p-3 text-base',
        sm: 'p-2 text-sm',
      },
      error: {
        true: 'border-field-border-error focus:border-field-border-error',
        false: '',
      },
    },
    defaultVariants: { size: 'md', error: false },
  },
)

export type TextareaProps = Omit<TextInputProps, 'style' | 'editable' | 'multiline'> &
  Omit<VariantProps<typeof textareaVariants>, 'error'> & {
    className?: string
    /** Borda e foco em vermelho. */
    error?: boolean
    disabled?: boolean
  }

export function Textarea({
  className,
  size,
  error = false,
  disabled = false,
  readOnly = false,
  accessibilityState,
  ...props
}: TextareaProps) {
  const placeholderColor = useToken('--color-field-text-placeholder')

  return (
    <TextInput
      multiline
      textAlignVertical="top"
      editable={!disabled && !readOnly}
      readOnly={readOnly}
      placeholderTextColor={placeholderColor}
      accessibilityState={{ ...accessibilityState, disabled }}
      className={cn(
        textareaVariants({ size, error }),
        disabled &&
          'border-field-border-disabled bg-field-bg-disabled text-field-text-disabled focus:border-field-border-disabled',
        readOnly && !disabled && 'border-transparent bg-field-bg-disabled focus:border-transparent',
        className,
      )}
      {...props}
    />
  )
}
