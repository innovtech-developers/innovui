import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

const spinnerVariants = cva('iu:inline-block iu:shrink-0', {
  variants: {
    size: {
      lg: 'iu:size-6', // 24px
      md: 'iu:size-5', // 20px
      sm: 'iu:size-4', // 16px
    },
  },
  defaultVariants: { size: 'md' },
})

export type SpinnerProps = ComponentProps<'span'> & VariantProps<typeof spinnerVariants>

/** Indicador indeterminado. Duração recomendada: menos de 3s. Para carregamento de página/seção, use Skeleton. */
export function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <span className="iu:relative iu:block iu:size-full">
        <span className="iu:absolute iu:inset-0 iu:rounded-full iu:border-2 iu:border-[var(--color-spinner-track)] iu:opacity-30" />
        <span className="iu:absolute iu:inset-0 iu:animate-spin iu:rounded-full iu:border-2 iu:border-transparent iu:border-t-[var(--color-spinner-indicator)]" />
      </span>
    </span>
  )
}
