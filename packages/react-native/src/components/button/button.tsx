/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { Pressable, type PressableProps, Text, View } from 'react-native'
import { cn } from '../../utils/cn'
import { Spinner } from '../spinner/spinner'

const buttonVariants = cva('flex-row items-center justify-center rounded-full', {
  variants: {
    variant: {
      primary:
        'bg-button-primary-bg active:bg-button-primary-bg-active disabled:bg-button-disabled-bg',
      secondary:
        'bg-button-secondary-bg active:bg-button-secondary-bg-hover disabled:bg-button-disabled-bg',
      tertiary: 'border border-button-tertiary-border bg-transparent active:bg-bg-secondary',
      ghost: 'bg-transparent active:bg-button-secondary-bg-hover',
      destructive:
        'bg-button-destructive-bg active:bg-button-destructive-bg-active disabled:bg-button-disabled-bg',
    },
    size: {
      lg: 'h-14 gap-2 px-6',
      md: 'h-11 gap-2 px-6',
      sm: 'h-9 gap-1 px-4',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

const labelVariants = cva('font-semibold', {
  variants: {
    variant: {
      primary: 'text-button-primary-text',
      secondary: 'text-button-secondary-text',
      tertiary: 'text-button-tertiary-text',
      ghost: 'text-button-ghost-text',
      destructive: 'text-button-destructive-text',
    },
    size: { lg: 'text-base', md: 'text-sm', sm: 'text-sm' },
    disabled: {
      true: 'text-button-disabled-text',
      false: '',
    },
  },
  compoundVariants: [
    { variant: 'destructive', disabled: true, className: 'text-button-disabled-text-destructive' },
  ],
  defaultVariants: { variant: 'primary', size: 'md', disabled: false },
})

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> &
  VariantProps<typeof buttonVariants> & {
    className?: string
    children: string
    /** Ícone antes do texto. Some junto ao label quando `loading` está ativo. */
    leadingIcon?: ReactNode
    /** Ícone depois do texto. Some junto ao label quando `loading` está ativo. */
    trailingIcon?: ReactNode
    /** Substitui os ícones por um spinner e desabilita o botão. */
    loading?: boolean
  }

export function Button({
  className,
  variant,
  size,
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled,
  children,
  accessibilityState,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} /> : leadingIcon}
      <Text className={labelVariants({ variant, size, disabled: isDisabled })}>{children}</Text>
      {!loading && trailingIcon ? <View>{trailingIcon}</View> : null}
    </Pressable>
  )
}
