'use client'

import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { CloseIcon, type Status, StatusIcon, statusRole, statusSurface } from '../_shared/status'
import { IconButton } from '../icon-button'

const border: Record<Status, string> = {
  success: 'iu:border-[var(--color-status-success-border)]',
  error: 'iu:border-[var(--color-status-error-border)]',
  warning: 'iu:border-[var(--color-status-warning-border)]',
  info: 'iu:border-[var(--color-status-info-border)]',
  neutral: 'iu:border-[var(--color-status-neutral-border)]',
}

export type AlertProps = Omit<ComponentProps<'div'>, 'title'> & {
  status?: Status
  /** Resumo do alerta (opcional). */
  title?: ReactNode
  /** Mostra o ícone semântico do status. */
  showIcon?: boolean
  /** Ação contextual (ex.: um `<Button variant="ghost">`). */
  action?: ReactNode
  /** Mostra o botão de fechar (×) e o chama ao clicar. */
  onDismiss?: () => void
  /** Nome acessível do botão de fechar. */
  dismissLabel?: string
}

/** Mensagem contextual em bloco, persistente. Para avisos temporários use Toast; para globais, Banner. */
export function Alert({
  className,
  status = 'info',
  title,
  showIcon = true,
  action,
  onDismiss,
  dismissLabel = 'Fechar',
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role={statusRole(status)}
      className={cn(
        'iu:flex iu:items-start iu:gap-3 iu:rounded-md iu:border-l-3 iu:py-3 iu:pr-3 iu:pl-4 iu:text-sm iu:leading-5',
        statusSurface[status],
        border[status],
        className,
      )}
      {...props}
    >
      {showIcon && <StatusIcon status={status} className="iu:shrink-0" />}
      <div className="iu:flex iu:min-w-0 iu:flex-1 iu:flex-col iu:items-start iu:gap-1">
        {title && <p className="iu:font-medium">{title}</p>}
        <div className="iu:text-[var(--color-text-primary)]">{children}</div>
        {action}
      </div>
      {onDismiss && (
        <IconButton aria-label={dismissLabel} variant="ghost" size="sm" onClick={onDismiss}>
          <CloseIcon />
        </IconButton>
      )}
    </div>
  )
}
