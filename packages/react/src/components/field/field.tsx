'use client'

import { cloneElement, type ReactElement, type ReactNode, useId } from 'react'
import { cn } from '../../utils/cn'

export type FieldProps = {
  /** Texto do rótulo. */
  label: string
  /** Exibe um asterisco vermelho após o rótulo. */
  required?: boolean
  /** Propaga vermelho para rótulo, borda do controle e texto de apoio. */
  error?: boolean
  disabled?: boolean
  /** Instrução (estado normal) ou mensagem de erro (estado error). */
  supportingText?: ReactNode
  /** O controle: Input, Textarea ou Select — recebe id/disabled/error/aria-describedby automaticamente. */
  children: ReactElement<{
    id?: string
    disabled?: boolean
    error?: boolean
    'aria-describedby'?: string
  }>
  className?: string
}

/** Combina Label + controle + texto de apoio — o jeito certo de montar um campo de formulário. */
export function Field({
  label,
  required,
  error,
  disabled,
  supportingText,
  children,
  className,
}: FieldProps) {
  const id = useId()
  const supportingId = supportingText ? `${id}-supporting` : undefined

  return (
    <div className={cn('iu:flex iu:flex-col iu:gap-1.5', className)}>
      <label
        htmlFor={id}
        className={cn(
          'iu:text-sm iu:font-medium iu:text-[var(--color-field-text-label)]',
          error && 'iu:text-[var(--color-status-error-text)]',
        )}
      >
        {label}
        {required && (
          <span className="iu:text-[var(--color-status-error-text)]" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {cloneElement(children, {
        id,
        disabled: disabled ?? children.props.disabled,
        error: error ?? children.props.error,
        'aria-describedby': supportingId,
      })}
      {supportingText && (
        <p
          id={supportingId}
          className={cn(
            'iu:text-sm iu:text-[var(--color-field-text-label)]',
            error && 'iu:text-[var(--color-status-error-text)]',
          )}
        >
          {supportingText}
        </p>
      )}
    </div>
  )
}
