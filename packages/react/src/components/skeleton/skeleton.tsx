import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

// Dimensões padrão do Figma; sobrescreva com className (ex.: `iu:w-full`) para casar com o conteúdo real.
const skeletonVariants = cva(
  'iu:animate-pulse iu:bg-[var(--color-bg-skeleton)] iu:motion-reduce:animate-none',
  {
    variants: {
      variant: {
        text: 'iu:h-3 iu:w-[200px] iu:rounded-sm',
        title: 'iu:h-5 iu:w-[160px] iu:rounded-sm',
        avatar: 'iu:size-10 iu:rounded-full',
        card: 'iu:h-[120px] iu:w-[300px] iu:rounded-md',
        rectangle: 'iu:h-6 iu:w-[200px] iu:rounded-md',
      },
    },
    defaultVariants: { variant: 'text' },
  },
)

export type SkeletonProps = ComponentProps<'div'> & VariantProps<typeof skeletonVariants>

/**
 * Placeholder de conteúdo em carregamento. É decorativo (`aria-hidden`): anuncie o carregamento
 * no contêiner, com `aria-busy="true"`. Para ações pontuais, use Spinner.
 */
export function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={cn(skeletonVariants({ variant }), className)} {...props} />
  )
}
