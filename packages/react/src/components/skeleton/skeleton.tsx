import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

// Altura do Figma; a largura ocupa o contêiner. Para largura fixa, use className (ex.: `iu:w-[200px]`).
const skeletonVariants = cva(
  'iu:animate-pulse iu:bg-[var(--color-bg-skeleton)] iu:motion-reduce:animate-none',
  {
    variants: {
      variant: {
        text: 'iu:h-3 iu:w-full iu:rounded-sm',
        title: 'iu:h-5 iu:w-full iu:rounded-sm',
        avatar: 'iu:size-10 iu:rounded-full',
        card: 'iu:h-[120px] iu:w-full iu:rounded-md',
        rectangle: 'iu:h-6 iu:w-full iu:rounded-md',
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
