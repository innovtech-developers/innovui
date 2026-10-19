import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

const tagVariants = cva(
  'iu:inline-flex iu:items-center iu:gap-1 iu:whitespace-nowrap iu:rounded-sm iu:px-2 iu:py-0.5 iu:text-xs iu:leading-4 iu:font-medium iu:text-[var(--color-text-primary)]',
  {
    variants: {
      variant: {
        filled: 'iu:bg-[var(--color-bg-secondary)]',
        outline: 'iu:border iu:border-[var(--color-border-default)]',
      },
    },
    defaultVariants: { variant: 'filled' },
  },
)

export type TagProps = ComponentProps<'span'> &
  VariantProps<typeof tagVariants> & {
    /** Mostra o botão de remoção (×) e o chama ao clicar. Sem ele, a Tag não é removível. */
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
  return (
    <span className={cn(tagVariants({ variant }), className)} {...props}>
      {children}
      {onDismiss && (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className="iu:inline-flex iu:size-4 iu:shrink-0 iu:cursor-pointer iu:items-center iu:justify-center iu:rounded-sm iu:text-[var(--color-text-secondary)] iu:focus-visible:outline-none iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 4L4 12M4 4L12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}
