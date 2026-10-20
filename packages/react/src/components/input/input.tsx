'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

/** Estilo do campo, compartilhado com o DatePicker (não faz parte da API pública). */
export const inputVariants = cva(
  'iu:w-full iu:bg-[var(--color-field-bg)] iu:text-[var(--color-field-text)] iu:placeholder:text-[var(--color-field-text-placeholder)] iu:rounded-md iu:border iu:border-[var(--color-field-border)] iu:transition-colors iu:outline-none iu:hover:border-[var(--color-field-border-hover)] iu:focus-visible:border-[var(--color-field-border-hover)] iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-field-focus-ring)] iu:disabled:cursor-not-allowed iu:disabled:bg-[var(--color-field-bg-disabled)] iu:disabled:text-[var(--color-field-text-disabled)] iu:disabled:border-[var(--color-field-border-disabled)] iu:read-only:bg-[var(--color-field-bg-disabled)] iu:[&[readonly]]:border-transparent iu:[&[readonly]]:hover:border-transparent iu:[&[readonly]]:focus-visible:border-transparent',
  {
    variants: {
      size: {
        lg: 'iu:h-14 iu:px-4 iu:text-base',
        md: 'iu:h-12 iu:px-3 iu:text-base',
        sm: 'iu:h-10 iu:px-2 iu:text-sm',
      },
      error: {
        true: 'iu:border-[var(--color-field-border-error)] iu:hover:border-[var(--color-field-border-error)] iu:focus-visible:border-[var(--color-field-border-error)]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

// Posição do ícone e recuo do texto por tamanho (Figma: padding + ícone 24/20/24 + gap 8/8/4).
const iconSlot = {
  lg: {
    icon: 'iu:size-5',
    left: 'iu:left-4',
    right: 'iu:right-4',
    padL: 'iu:pl-11',
    padR: 'iu:pr-11',
  },
  md: {
    icon: 'iu:size-6',
    left: 'iu:left-3',
    right: 'iu:right-3',
    padL: 'iu:pl-11',
    padR: 'iu:pr-11',
  },
  sm: {
    icon: 'iu:size-6',
    left: 'iu:left-2',
    right: 'iu:right-2',
    padL: 'iu:pl-9',
    padR: 'iu:pr-9',
  },
}

export type InputProps = Omit<ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants> & {
    /** Ícone antes do texto. */
    leadingIcon?: ReactNode
    /** Ícone depois do texto. */
    trailingIcon?: ReactNode
  }

export function Input({
  className,
  size,
  error,
  leadingIcon,
  trailingIcon,
  disabled,
  ...props
}: InputProps) {
  const slot = iconSlot[size ?? 'md']

  if (!leadingIcon && !trailingIcon) {
    return (
      <input
        disabled={disabled}
        aria-invalid={error || undefined}
        className={cn(inputVariants({ size, error }), className)}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn('iu:relative iu:flex iu:items-center', disabled && 'iu:pointer-events-none')}
    >
      {leadingIcon && (
        <span
          className={cn(
            'iu:pointer-events-none iu:absolute iu:flex iu:items-center iu:text-[var(--color-field-text-placeholder)] iu:[&_svg]:size-full',
            slot.icon,
            slot.left,
          )}
        >
          {leadingIcon}
        </span>
      )}
      <input
        disabled={disabled}
        aria-invalid={error || undefined}
        className={cn(
          inputVariants({ size, error }),
          leadingIcon && slot.padL,
          trailingIcon && slot.padR,
          className,
        )}
        {...props}
      />
      {trailingIcon && (
        <span
          className={cn(
            'iu:pointer-events-none iu:absolute iu:flex iu:items-center iu:text-[var(--color-field-text-placeholder)] iu:[&_svg]:size-full',
            slot.icon,
            slot.right,
          )}
        >
          {trailingIcon}
        </span>
      )}
    </div>
  )
}
