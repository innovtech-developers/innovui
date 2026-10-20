import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'
import { ChevronRightIcon } from '../_shared/status'
import { IconButton } from '../icon-button'

/**
 * Páginas a mostrar: a primeira, a última, a atual e `siblingCount` vizinhas de cada lado, com
 * reticências no que sobra. Mantém sempre o mesmo número de itens, para a barra não pular.
 */
export function getPages(page: number, pageCount: number, siblingCount = 1) {
  const slots = siblingCount * 2 + 5
  if (pageCount <= slots) return Array.from({ length: pageCount }, (_, i) => i + 1)

  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i)
  const left = Math.max(page - siblingCount, 1)
  const right = Math.min(page + siblingCount, pageCount)
  const dotsLeft = left > 2
  const dotsRight = right < pageCount - 1
  const edge = 3 + siblingCount * 2

  if (!dotsLeft) return [...range(1, edge), 'ellipsis-right' as const, pageCount]
  if (!dotsRight) return [1, 'ellipsis-left' as const, ...range(pageCount - edge + 1, pageCount)]
  return [1, 'ellipsis-left' as const, ...range(left, right), 'ellipsis-right' as const, pageCount]
}

export type PaginationProps = Omit<ComponentProps<'nav'>, 'onChange'> & {
  /** Página atual, começando em 1. */
  page: number
  /** Total de páginas. */
  pageCount: number
  /** Chamado com o número da página escolhida. */
  onPageChange: (page: number) => void
  /** Quantas páginas vizinhas da atual mostrar de cada lado. */
  siblingCount?: number
  /** Nome acessível do botão de página anterior. */
  previousLabel?: string
  /** Nome acessível do botão de próxima página. */
  nextLabel?: string
}

/** Navegação entre páginas de uma lista ou tabela. Controlado: você guarda o estado de `page`. */
export function Pagination({
  className,
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  previousLabel = 'Página anterior',
  nextLabel = 'Próxima página',
  'aria-label': ariaLabel = 'Paginação',
  ...props
}: PaginationProps) {
  return (
    <nav aria-label={ariaLabel} className={className} {...props}>
      <ul className={cn('iu:m-0 iu:flex iu:list-none iu:items-center iu:gap-1 iu:p-0')}>
        <li>
          <IconButton
            aria-label={previousLabel}
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronRightIcon className="iu:rotate-180" />
          </IconButton>
        </li>
        {getPages(page, pageCount, siblingCount).map((item) => (
          <li key={item}>
            {typeof item === 'string' ? (
              <span
                aria-hidden="true"
                className="iu:flex iu:size-9 iu:items-center iu:justify-center iu:text-sm iu:text-[var(--color-text-secondary)]"
              >
                …
              </span>
            ) : (
              <IconButton
                aria-label={`Página ${item}`}
                aria-current={item === page ? 'page' : undefined}
                variant={item === page ? 'primary' : 'ghost'}
                size="sm"
                className="iu:text-sm iu:font-medium"
                onClick={() => onPageChange(item)}
              >
                {item}
              </IconButton>
            )}
          </li>
        ))}
        <li>
          <IconButton
            aria-label={nextLabel}
            variant="ghost"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRightIcon />
          </IconButton>
        </li>
      </ul>
    </nav>
  )
}
