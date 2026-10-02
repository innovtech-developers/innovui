'use client'

import type { ComponentProps, ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '../../utils/cn'

export type RadioProps = Omit<ComponentProps<'input'>, 'type' | 'size'> & {
  label?: ReactNode
  error?: boolean
}

export function Radio({ label, error, className, id, ...props }: RadioProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'iu:inline-flex iu:items-center iu:gap-2 iu:cursor-pointer iu:has-disabled:cursor-not-allowed iu:has-disabled:opacity-60',
        className,
      )}
    >
      <span className="iu:relative iu:inline-grid iu:size-5 iu:shrink-0 iu:place-items-center">
        <input
          type="radio"
          id={inputId}
          className="iu:peer iu:absolute iu:inset-0 iu:size-full iu:cursor-pointer iu:appearance-none iu:disabled:cursor-not-allowed"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            'iu:pointer-events-none iu:absolute iu:inset-0 iu:rounded-full iu:border-2 iu:border-[var(--color-selection-border-unselected)] iu:bg-[var(--color-selection-bg-unselected)] iu:transition-colors',
            'iu:peer-checked:border-[var(--color-selection-border-selected)]',
            'iu:peer-focus-visible:ring-2 iu:peer-focus-visible:ring-[var(--color-selection-focus-ring)] iu:peer-focus-visible:ring-offset-2',
            'iu:peer-disabled:border-[var(--color-selection-border-disabled)] iu:peer-disabled:bg-[var(--color-selection-bg-disabled)]',
            error && 'iu:border-[var(--color-status-error-border)]',
          )}
        />
        <span
          aria-hidden="true"
          className="iu:pointer-events-none iu:absolute iu:size-2.5 iu:scale-0 iu:rounded-full iu:bg-[var(--color-selection-bg-selected)] iu:transition-transform iu:peer-checked:scale-100 iu:peer-disabled:bg-[var(--color-selection-text-disabled)]"
        />
      </span>
      {label && (
        <span className="iu:text-sm iu:text-[var(--color-selection-text-label)] iu:select-none">
          {label}
        </span>
      )}
    </label>
  )
}
