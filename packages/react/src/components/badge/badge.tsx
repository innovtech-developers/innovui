import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

const badgeVariants = cva(
  'iu:inline-flex iu:items-center iu:justify-center iu:gap-1 iu:whitespace-nowrap iu:rounded-full iu:px-2 iu:py-0.5 iu:text-xs iu:leading-4 iu:font-medium',
  {
    variants: {
      status: {
        success:
          'iu:bg-[var(--color-status-success-bg)] iu:text-[var(--color-status-success-text)]',
        error: 'iu:bg-[var(--color-status-error-bg)] iu:text-[var(--color-status-error-text)]',
        warning:
          'iu:bg-[var(--color-status-warning-bg)] iu:text-[var(--color-status-warning-text)]',
        info: 'iu:bg-[var(--color-status-info-bg)] iu:text-[var(--color-status-info-text)]',
        neutral:
          'iu:bg-[var(--color-status-neutral-bg)] iu:text-[var(--color-status-neutral-text)]',
        pending:
          'iu:bg-[var(--color-status-pending-bg)] iu:text-[var(--color-status-pending-text)]',
      },
    },
    defaultVariants: { status: 'neutral' },
  },
)

export type BadgeProps = ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    /** Indicador circular antes do texto, na cor do status. */
    dot?: boolean
  }

/** Indicador de status, não interativo. Para categorizar ou rotular conteúdo, use Tag. */
export function Badge({ className, status, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ status }), className)} {...props}>
      {dot && (
        <span
          aria-hidden="true"
          className="iu:size-1.5 iu:shrink-0 iu:rounded-[3px] iu:bg-current"
        />
      )}
      {children}
    </span>
  )
}
