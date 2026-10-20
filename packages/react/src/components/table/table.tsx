import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type TableProps = ComponentProps<'table'>

/**
 * Tabela de dados. Em telas estreitas a tabela rola na horizontal, sem estourar o layout.
 * Dê um `TableCaption` (ou `aria-label`) para nomear a tabela.
 */
export function Table({ className, ...props }: TableProps) {
  return (
    <div className="iu:w-full iu:overflow-x-auto">
      <table
        className={cn(
          'iu:w-full iu:border-collapse iu:text-left iu:text-sm iu:leading-5 iu:text-[var(--color-text-primary)]',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export type TableCaptionProps = ComponentProps<'caption'>

/** Nome e descrição da tabela, lidos antes do conteúdo por leitores de tela. */
export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      className={cn(
        'iu:pb-3 iu:text-left iu:text-sm iu:leading-5 iu:text-[var(--color-text-secondary)]',
        className,
      )}
      {...props}
    />
  )
}

export type TableHeaderProps = ComponentProps<'thead'>

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead className={cn('iu:bg-[var(--color-bg-secondary)]', className)} {...props} />
}

export type TableBodyProps = ComponentProps<'tbody'>

export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody className={cn('iu:[&_tr:hover]:bg-[var(--color-bg-secondary)]', className)} {...props} />
  )
}

export type TableRowProps = ComponentProps<'tr'>

export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn('iu:border-b iu:border-[var(--color-border-default)]', className)}
      {...props}
    />
  )
}

export type TableHeadProps = ComponentProps<'th'>

/** Célula de cabeçalho. Para ordenação, passe `aria-sort` ("ascending" ou "descending"). */
export function TableHead({ className, scope = 'col', ...props }: TableHeadProps) {
  return (
    <th
      scope={scope}
      className={cn(
        'iu:px-4 iu:py-3 iu:text-xs iu:leading-4 iu:font-medium iu:whitespace-nowrap iu:text-[var(--color-text-secondary)]',
        className,
      )}
      {...props}
    />
  )
}

export type TableCellProps = ComponentProps<'td'>

export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={cn('iu:px-4 iu:py-3', className)} {...props} />
}
