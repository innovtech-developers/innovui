import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'
import { ChevronRightIcon } from '../_shared/status'

export type BreadcrumbProps = ComponentProps<'nav'>

/** Hierarquia de páginas (Início › Seção › Página). Para fluxos sequenciais, use Stepper. */
export function Breadcrumb({
  className,
  children,
  'aria-label': ariaLabel = 'Breadcrumb',
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} className={className} {...props}>
      <ol className="iu:flex iu:flex-wrap iu:items-center iu:gap-1">{children}</ol>
    </nav>
  )
}

export type BreadcrumbItemProps = ComponentProps<'li'> & {
  /** Marca o item da página atual: não é link e ganha `aria-current="page"`. */
  current?: boolean
  /** Renderiza o filho como o link (ex.: o `<Link>` do seu roteador), em vez de um `<a>`. */
  asChild?: boolean
  href?: string
}

/** Um item da trilha. O separador (›) aparece depois de todos, menos do último. */
export function BreadcrumbItem({
  className,
  current = false,
  asChild = false,
  href,
  children,
  ...props
}: BreadcrumbItemProps) {
  const Link = asChild ? Slot : 'a'

  return (
    <li
      className={cn('iu:group iu:flex iu:items-center iu:gap-2 iu:text-sm iu:leading-5', className)}
      {...props}
    >
      {current ? (
        <span aria-current="page" className="iu:font-medium iu:text-[var(--color-text-primary)]">
          {children}
        </span>
      ) : (
        <Link
          href={href}
          className="iu:rounded-sm iu:text-[var(--color-text-secondary)] iu:outline-none iu:hover:text-[var(--color-interactive-primary-hover)] iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)] iu:focus-visible:ring-offset-2"
        >
          {children}
        </Link>
      )}
      <ChevronRightIcon className="iu:shrink-0 iu:text-[var(--color-text-tertiary)] iu:group-last:hidden" />
    </li>
  )
}
