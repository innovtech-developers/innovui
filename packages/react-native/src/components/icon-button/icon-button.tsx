/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { Pressable, type PressableProps } from 'react-native'
import { cn } from '../../utils/cn'
import { Spinner } from '../spinner/spinner'

// Mesmos estilos do Button (não exportados de lá). Quadrado 1:1 nas alturas 56/44/36.
const iconButtonVariants = cva('shrink-0 items-center justify-center rounded-full', {
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
      lg: 'size-14',
      md: 'size-11',
      sm: 'size-9',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export type IconButtonProps = Omit<PressableProps, 'children' | 'style' | 'accessibilityLabel'> &
  VariantProps<typeof iconButtonVariants> & {
    className?: string
    /** Obrigatório: sem texto visível, é o nome acessível do botão. */
    accessibilityLabel: string
    /**
     * O ícone. No native a cor não é herdada: passe `color` ao ícone (ex.: lida com `useCSSVariable`, do uniwind).
     * O tamanho do ícone também fica por conta de quem passa (24/20/16 por `size`).
     */
    children: ReactNode
    /** Estado de carregamento: troca o ícone por um spinner e desabilita o botão. */
    loading?: boolean
  }

export function IconButton({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  accessibilityState,
  ...props
}: IconButtonProps) {
  const isDisabled = Boolean(disabled || loading)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? <Spinner size={size ?? 'md'} /> : children}
    </Pressable>
  )
}
