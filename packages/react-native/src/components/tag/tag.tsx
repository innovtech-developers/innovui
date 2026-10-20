/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import { Pressable, Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'
import { CloseIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'

const tagVariants = cva('flex-row items-center gap-1 self-start rounded-sm px-2 py-0.5', {
  variants: {
    variant: {
      filled: 'bg-bg-secondary',
      outline: 'border border-border-default',
    },
  },
  defaultVariants: { variant: 'filled' },
})

export type TagProps = Omit<ViewProps, 'children'> &
  VariantProps<typeof tagVariants> & {
    className?: string
    children: string
    /** Mostra o botão de remoção (×) e o chama ao tocar. Sem ele, a Tag não é removível. */
    onDismiss?: () => void
    /** Nome acessível do botão de remoção. */
    dismissLabel?: string
  }

/** Rótulo de categoria ou filtro, opcionalmente removível. Para status, use Badge. */
export function Tag({
  className,
  variant,
  onDismiss,
  dismissLabel = 'Remover',
  children,
  ...props
}: TagProps) {
  const iconColor = useToken('--color-text-secondary')

  return (
    <View className={cn(tagVariants({ variant }), className)} {...props}>
      <Text className="text-xs font-medium leading-4 text-text-primary">{children}</Text>
      {onDismiss && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={dismissLabel}
          onPress={onDismiss}
          hitSlop={8}
          className="size-4 shrink-0 items-center justify-center rounded-sm"
        >
          <CloseIcon color={iconColor} />
        </Pressable>
      )}
    </View>
  )
}
