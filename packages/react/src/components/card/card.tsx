import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

const cardVariants = cva(
  'iu:rounded-md iu:border iu:border-[var(--color-border-default)] iu:bg-[var(--color-surface-elevated)] iu:text-[var(--color-text-primary)] iu:shadow-md',
  {
    variants: {
      padding: { none: '', md: 'iu:p-4', lg: 'iu:p-6' },
    },
    defaultVariants: { padding: 'md' },
  },
)

export type CardProps = ComponentProps<'div'> & VariantProps<typeof cardVariants>

/**
 * Contêiner elevado (borda, raio e sombra) para agrupar conteúdo relacionado.
 * Use `padding="none"` para mídia de ponta a ponta.
 */
export function Card({ className, padding, ...props }: CardProps) {
  return <div className={cn(cardVariants({ padding }), className)} {...props} />
}
