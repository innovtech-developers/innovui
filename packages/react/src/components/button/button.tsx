'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Spinner } from '../spinner/spinner'

const buttonVariants = cva(
  'iu:inline-flex iu:items-center iu:justify-center iu:gap-2 iu:whitespace-nowrap iu:rounded-full iu:font-medium iu:transition-colors iu:focus-visible:outline-none iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-button-focus-ring)] iu:focus-visible:ring-offset-2 iu:disabled:pointer-events-none iu:disabled:bg-[var(--color-button-disabled-bg)] iu:disabled:text-[var(--color-button-disabled-text)]',
  {
    variants: {
      variant: {
        primary:
          'iu:bg-[var(--color-button-primary-bg)] iu:text-[var(--color-button-primary-text)] iu:hover:bg-[var(--color-button-primary-bg-hover)] iu:active:bg-[var(--color-button-primary-bg-active)]',
        secondary:
          'iu:bg-[var(--color-button-secondary-bg)] iu:text-[var(--color-button-secondary-text)] iu:hover:bg-[var(--color-button-secondary-bg-hover)]',
        tertiary:
          'iu:border iu:border-[var(--color-button-tertiary-border)] iu:bg-transparent iu:text-[var(--color-button-tertiary-text)] iu:hover:bg-[var(--color-bg-secondary)]',
        ghost:
          'iu:bg-transparent iu:text-[var(--color-button-ghost-text)] iu:hover:bg-[var(--color-button-ghost-bg-hover)]',
        destructive:
          'iu:bg-[var(--color-button-destructive-bg)] iu:text-[var(--color-button-destructive-text)] iu:hover:bg-[var(--color-button-destructive-bg-hover)] iu:active:bg-[var(--color-button-destructive-bg-active)] iu:disabled:text-[var(--color-button-disabled-text-destructive)]',
      },
      size: {
        lg: 'iu:h-14 iu:px-6 iu:text-base',
        md: 'iu:h-11 iu:px-4 iu:text-sm',
        sm: 'iu:h-9 iu:px-3 iu:text-xs',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = Omit<ComponentProps<'button'>, 'children'> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode
    /** Ícone antes do texto. Some junto ao label quando `loading` está ativo. */
    leadingIcon?: ReactNode
    /** Ícone depois do texto. Some junto ao label quando `loading` está ativo. */
    trailingIcon?: ReactNode
    /** Estado de carregamento: substitui os ícones por um spinner e desabilita o botão. */
    loading?: boolean
  }

export function Button({
  className,
  variant,
  size,
  type = 'button',
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  )
}
