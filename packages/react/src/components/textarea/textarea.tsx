'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

const textareaVariants = cva(
  'iu:w-full iu:resize-y iu:bg-[var(--color-field-bg)] iu:text-[var(--color-field-text)] iu:placeholder:text-[var(--color-field-text-placeholder)] iu:rounded-md iu:border iu:border-[var(--color-field-border)] iu:transition-colors iu:outline-none iu:hover:border-[var(--color-field-border-hover)] iu:focus-visible:border-[var(--color-field-focus-ring)] iu:focus-visible:ring-1 iu:focus-visible:ring-inset iu:focus-visible:ring-[var(--color-field-focus-ring)] iu:disabled:cursor-not-allowed iu:disabled:bg-[var(--color-field-bg-disabled)] iu:disabled:text-[var(--color-field-text-disabled)] iu:disabled:border-[var(--color-field-border-disabled)] iu:read-only:bg-[var(--color-field-bg-disabled)] iu:[&[readonly]]:border-transparent iu:[&[readonly]]:hover:border-transparent iu:[&[readonly]]:focus-visible:border-transparent',
  {
    variants: {
      size: {
        lg: 'iu:min-h-[7.5rem] iu:p-4 iu:text-base',
        md: 'iu:min-h-[7.5rem] iu:p-3 iu:text-base',
        sm: 'iu:min-h-[7.5rem] iu:p-2 iu:text-sm',
      },
      error: {
        true: 'iu:border-[var(--color-field-border-error)] iu:hover:border-[var(--color-field-border-error)] iu:focus-visible:border-[var(--color-field-border-error)]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type TextareaProps = Omit<ComponentProps<'textarea'>, 'size'> &
  VariantProps<typeof textareaVariants>

export function Textarea({ className, size, error, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={error || undefined}
      className={cn(textareaVariants({ size, error }), className)}
      {...props}
    />
  )
}
