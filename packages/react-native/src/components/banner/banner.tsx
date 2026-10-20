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
  statusTextToken,
} from '../_shared/status'
import { useToken } from '../_shared/use-token'
import { IconButton } from '../icon-button/icon-button'

export type BannerProps = ViewProps & {
  className?: string
  status?: Status
  /** Mostra o ícone semântico do status. */
  showIcon?: boolean
  /** Ação ao lado da mensagem (ex.: um `<Button variant="ghost">`). */
  action?: ReactNode
  /** Mostra o botão de fechar (×) e o chama ao tocar. */
  onDismiss?: () => void
  /** Nome acessível do botão de fechar. */
  dismissLabel?: string
}

/**
 * Mensagem persistente em largura total, no topo da interface (manutenção, anúncios).
 * `children` string vira `Text`; outros nós são renderizados como estão.
 */
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
  const statusColor = useToken(statusTextToken[status])
  const closeColor = useToken('--color-button-ghost-text')

  return (
    <View
      accessibilityRole={statusRole(status)}
      className={cn('w-full flex-row items-start gap-3 px-4 py-3', statusBg[status], className)}
      {...props}
    >
      {showIcon && (
        <View className="shrink-0">
          <StatusIcon status={status} color={statusColor} />
        </View>
      )}
      <View className="min-w-0 flex-1 flex-row items-center gap-2">
        <View className="min-w-0 flex-1">
          {typeof children === 'string' ? (
            <Text className="text-sm leading-5 text-text-primary">{children}</Text>
          ) : (
            children
          )}
        </View>
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
