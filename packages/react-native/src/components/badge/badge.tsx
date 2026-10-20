/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import { Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

const badgeVariants = cva(
  'flex-row items-center justify-center gap-1 self-start rounded-full px-2 py-0.5',
  {
    variants: {
      status: {
        success: 'bg-status-success-bg',
        error: 'bg-status-error-bg',
        warning: 'bg-status-warning-bg',
        info: 'bg-status-info-bg',
        neutral: 'bg-status-neutral-bg',
        pending: 'bg-status-pending-bg',
      },
    },
    defaultVariants: { status: 'neutral' },
  },
)

const labelVariants = cva('text-xs font-medium leading-4', {
  variants: {
    status: {
      success: 'text-status-success-text',
      error: 'text-status-error-text',
      warning: 'text-status-warning-text',
      info: 'text-status-info-text',
      neutral: 'text-status-neutral-text',
      pending: 'text-status-pending-text',
    },
  },
  defaultVariants: { status: 'neutral' },
})

// Sem `currentColor` no native: o ponto usa o token de texto do status.
const dotVariants = cva('size-1.5 shrink-0 rounded-[3px]', {
  variants: {
    status: {
      success: 'bg-status-success-text',
      error: 'bg-status-error-text',
      warning: 'bg-status-warning-text',
      info: 'bg-status-info-text',
      neutral: 'bg-status-neutral-text',
      pending: 'bg-status-pending-text',
    },
  },
  defaultVariants: { status: 'neutral' },
})

export type BadgeProps = Omit<ViewProps, 'children'> &
  VariantProps<typeof badgeVariants> & {
    className?: string
    children: string
    /** Indicador circular antes do texto, na cor do status. */
    dot?: boolean
  }

/** Indicador de status, não interativo. Para categorizar ou rotular conteúdo, use Tag. */
export function Badge({ className, status, dot = false, children, ...props }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ status }), className)} {...props}>
      {dot && (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className={dotVariants({ status })}
        />
      )}
      <Text className={labelVariants({ status })}>{children}</Text>
    </View>
  )
}
