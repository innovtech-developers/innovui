'use client'

import { type ComponentProps, type ReactNode, useEffect, useId, useRef } from 'react'
import { cn } from '../../utils/cn'

export type CheckboxProps = Omit<ComponentProps<'input'>, 'type' | 'size'> & {
  label?: ReactNode
  /** Seleção parcial — não é um atributo HTML, é sincronizado via ref na propriedade DOM. */
  indeterminate?: boolean
  error?: boolean
}

export function Checkbox({
  label,
  indeterminate = false,
  error,
  className,
  id,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const inputId = id ?? generatedId

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

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
          ref={inputRef}
          type="checkbox"
          id={inputId}
          className="iu:peer iu:absolute iu:inset-0 iu:size-full iu:cursor-pointer iu:appearance-none iu:disabled:cursor-not-allowed"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            'iu:pointer-events-none iu:absolute iu:inset-0 iu:rounded iu:border-2 iu:border-[var(--color-selection-border-unselected)] iu:bg-[var(--color-selection-bg-unselected)] iu:transition-colors',
            'iu:peer-checked:border-[var(--color-selection-border-selected)] iu:peer-checked:bg-[var(--color-selection-bg-selected)]',
            'iu:peer-indeterminate:border-[var(--color-selection-border-selected)] iu:peer-indeterminate:bg-[var(--color-selection-bg-selected)]',
            'iu:peer-focus-visible:ring-2 iu:peer-focus-visible:ring-[var(--color-selection-focus-ring)] iu:peer-focus-visible:ring-offset-2',
            'iu:peer-disabled:border-[var(--color-selection-border-disabled)] iu:peer-disabled:bg-[var(--color-selection-bg-disabled)]',
            error && 'iu:border-[var(--color-status-error-border)]',
          )}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="iu:pointer-events-none iu:absolute iu:size-3.5 iu:text-[var(--color-selection-indicator-selected)] iu:opacity-0 iu:peer-checked:opacity-100 iu:peer-indeterminate:opacity-0"
        >
          <path
            d="M3 8.5 6.5 12 13 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="iu:pointer-events-none iu:absolute iu:size-3.5 iu:text-[var(--color-selection-indicator-selected)] iu:opacity-0 iu:peer-indeterminate:opacity-100"
        >
          <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      {label && (
        <span className="iu:text-sm iu:text-[var(--color-selection-text-label)] iu:select-none">
          {label}
        </span>
      )}
    </label>
  )
}
