'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

const inputVariants = cva(
  'iu:w-full iu:bg-[var(--color-field-bg)] iu:text-[var(--color-field-text)] iu:placeholder:text-[var(--color-field-text-placeholder)] iu:rounded-md iu:border iu:border-[var(--color-field-border)] iu:transition-colors iu:outline-none iu:hover:border-[var(--color-field-border-hover)] iu:focus-visible:border-[var(--color-field-border-hover)] iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-field-focus-ring)] iu:disabled:cursor-not-allowed iu:disabled:bg-[var(--color-field-bg-disabled)] iu:disabled:text-[var(--color-field-text-disabled)] iu:disabled:border-[var(--color-field-border-disabled)] iu:read-only:bg-[var(--color-field-bg-disabled)]',
  {
    variants: {
      size: {
        lg: 'iu:h-14 iu:px-4 iu:text-base',
        md: 'iu:h-12 iu:px-4 iu:text-base',
        sm: 'iu:h-10 iu:px-3 iu:text-sm',
      },
      error: {
        true: 'iu:border-[var(--color-field-border-error)] iu:hover:border-[var(--color-field-border-error)] iu:focus-visible:border-[var(--color-field-border-error)]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

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
        <span className="iu:absolute iu:left-3 iu:flex iu:items-center iu:text-[var(--color-field-text-placeholder)]">
          {leadingIcon}
        </span>
      )}
      <input
        disabled={disabled}
        aria-invalid={error || undefined}
        className={cn(
          inputVariants({ size, error }),
          leadingIcon && 'iu:pl-10',
          trailingIcon && 'iu:pr-10',
          className,
        )}
        {...props}
      />
      {trailingIcon && (
        <span className="iu:absolute iu:right-3 iu:flex iu:items-center iu:text-[var(--color-field-text-placeholder)]">
          {trailingIcon}
        </span>
      )}
    </div>
  )
}
