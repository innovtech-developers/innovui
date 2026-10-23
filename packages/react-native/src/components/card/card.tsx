/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import { View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

const cardVariants = cva(
  'rounded-[8px] border border-border-default bg-surface-elevated shadow-md',
  {
    variants: {
      padding: { none: '', md: 'p-4', lg: 'p-6' },
    },
    defaultVariants: { padding: 'md' },
  },
)

export type CardProps = ViewProps & VariantProps<typeof cardVariants> & { className?: string }

/**
 * Contêiner elevado (borda, raio e sombra) para agrupar conteúdo relacionado.
 * Use `padding="none"` para mídia de ponta a ponta. No native, o texto não herda cor: use
 * `text-text-primary` nos `Text` filhos.
 */
export function Card({ className, padding, ...props }: CardProps) {
  return <View className={cn(cardVariants({ padding }), className)} {...props} />
}
