'use client'

import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { CloseIcon, type Status, StatusIcon, statusRole, statusSurface } from '../_shared/status'
import { IconButton } from '../icon-button'

export type BannerProps = ComponentProps<'div'> & {
  status?: Status
  /** Mostra o ícone semântico do status. */
  showIcon?: boolean
  /** Ação ao lado da mensagem (ex.: um `<Button variant="ghost" size="sm">`). */
  action?: ReactNode
  /** Mostra o botão de fechar (×) e o chama ao clicar. */
  onDismiss?: () => void
  /** Nome acessível do botão de fechar. */
  dismissLabel?: string
}

/** Mensagem persistente em largura total, no topo da interface (manutenção, anúncios). */
export function Banner({
  className,
  status = 'info',
  showIcon = true,
  action,
  onDismiss,
  dismissLabel = 'Fechar',
  children,
  ...props
}: BannerProps) {
  return (
    <div
      role={statusRole(status)}
      className={cn(
        'iu:flex iu:w-full iu:items-start iu:gap-3 iu:px-4 iu:py-3 iu:text-sm iu:leading-5',
        statusSurface[status],
        className,
      )}
      {...props}
    >
      {showIcon && <StatusIcon status={status} className="iu:shrink-0" />}
      <div className="iu:flex iu:min-w-0 iu:flex-1 iu:items-center iu:gap-2">
        <div className="iu:min-w-0 iu:flex-1 iu:text-[var(--color-text-primary)]">{children}</div>
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
