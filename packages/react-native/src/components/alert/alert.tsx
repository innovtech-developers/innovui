/// <reference types="uniwind/types" />

import type { ReactNode } from 'react'
import { Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'
import {
  CloseIcon,
  type Status,
  StatusIcon,
  statusBg,
  statusRole,
  statusText,
  statusTextToken,
} from '../_shared/status'
import { useToken } from '../_shared/use-token'
import { IconButton } from '../icon-button/icon-button'

const border: Record<Status, string> = {
  success: 'border-status-success-border',
  error: 'border-status-error-border',
  warning: 'border-status-warning-border',
  info: 'border-status-info-border',
  neutral: 'border-status-neutral-border',
}

export type AlertProps = ViewProps & {
  className?: string
  status?: Status
  /** Resumo do alerta (opcional). */
  title?: string
  /** Mostra o ícone semântico do status. */
  showIcon?: boolean
  /** Ação contextual (ex.: um `<Button variant="ghost">`). */
  action?: ReactNode
  /** Mostra o botão de fechar (×) e o chama ao tocar. */
  onDismiss?: () => void
  /** Nome acessível do botão de fechar. */
  dismissLabel?: string
}

/**
 * Mensagem contextual em bloco, persistente. Para avisos temporários use Toast; para globais,
 * Banner. `children` string vira `Text`; outros nós são renderizados como estão.
 */
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
  const statusColor = useToken(statusTextToken[status])
  const closeColor = useToken('--color-button-ghost-text')

  return (
    <View
      accessibilityRole={statusRole(status)}
      className={cn(
        'flex-row items-start gap-3 rounded-[8px] border-l-[3px] py-3 pr-3 pl-4',
        statusBg[status],
        border[status],
        className,
      )}
      {...props}
    >
      {showIcon && (
        <View className="shrink-0">
          <StatusIcon status={status} color={statusColor} />
        </View>
      )}
      <View className="min-w-0 flex-1 items-start gap-1">
        {title ? (
          <Text className={cn('text-sm font-medium leading-5', statusText[status])}>{title}</Text>
        ) : null}
        {typeof children === 'string' ? (
          <Text className="text-sm leading-5 text-text-primary">{children}</Text>
        ) : (
          children
        )}
        {action}
      </View>
      {onDismiss && (
        <IconButton accessibilityLabel={dismissLabel} variant="ghost" size="sm" onPress={onDismiss}>
          <CloseIcon color={closeColor} />
        </IconButton>
      )}
    </View>
  )
}
