'use client'

import { cloneElement, type ReactElement, type ReactNode, useId } from 'react'
import { cn } from '../../utils/cn'
import { StatusIcon } from '../_shared/status'

export type FieldProps = {
  /** Texto do rótulo. */
  label: string
  /** Exibe um asterisco vermelho após o rótulo. */
  required?: boolean
  /** Propaga vermelho para rótulo, borda do controle e texto de apoio. */
  error?: boolean
  disabled?: boolean
  /** Propaga somente leitura ao controle. */
  readOnly?: boolean
  /** Tamanho do rótulo e do controle (o `sm` usa rótulo de 12px). */
  size?: 'sm' | 'md' | 'lg'
  /** Instrução (estado normal) ou mensagem de erro (estado error). */
  supportingText?: ReactNode
  /** O controle: Input, Textarea ou Select — recebe id/disabled/error/aria-describedby automaticamente. */
  children: ReactElement<{
    id?: string
    disabled?: boolean
    readOnly?: boolean
    size?: 'sm' | 'md' | 'lg'
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
  readOnly,
  size,
  supportingText,
  children,
  className,
}: FieldProps) {
  const id = useId()
  const supportingId = supportingText ? `${id}-supporting` : undefined

  return (
    <div className={cn('iu:flex iu:flex-col iu:gap-1', className)}>
      <label
        htmlFor={id}
        className={cn(
          'iu:font-medium iu:text-[var(--color-field-text-label)]',
          size === 'sm' ? 'iu:text-xs iu:leading-4' : 'iu:text-sm',
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
        readOnly: readOnly ?? children.props.readOnly,
        size: size ?? children.props.size,
        error: error ?? children.props.error,
        'aria-describedby': supportingId,
      })}
      {supportingText && (
        <p
          id={supportingId}
          className={cn(
            'iu:flex iu:items-center iu:gap-1 iu:text-xs iu:leading-4 iu:text-[var(--color-field-text-label)]',
            error && 'iu:text-[var(--color-status-error-text)]',
          )}
        >
          {error && <StatusIcon status="error" width={16} height={16} className="iu:shrink-0" />}
          {supportingText}
        </p>
      )}
    </div>
  )
}
