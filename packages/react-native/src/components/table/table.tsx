/// <reference types="uniwind/types" />

import type { ReactNode } from 'react'
import { ScrollView, Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

// RN não tem colunas automáticas: cada célula é `flex-1` com largura mínima, e a tabela rola na
// horizontal quando as colunas não cabem. Ajuste a largura de uma coluna com `className`
// (ex.: `w-40 flex-none`) em TODAS as células dela.

/** Texto puro vira `Text` estilizado; qualquer outro nó é renderizado como veio. */
function CellContent({ children, className }: { children: ReactNode; className: string }) {
  return typeof children === 'string' || typeof children === 'number' ? (
    <Text className={className}>{children}</Text>
  ) : (
    children
  )
}

export type TableProps = ViewProps & {
  className?: string
}

/**
 * Tabela de dados. Em telas estreitas a tabela rola na horizontal, sem estourar o layout.
 * Dê um `TableCaption` (ou `accessibilityLabel`) para nomear a tabela.
 */
export function Table({ className, ...props }: TableProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full grow-0">
      <View role="grid" className={cn('min-w-full', className)} {...props} />
    </ScrollView>
  )
}

export type TableCaptionProps = Omit<ViewProps, 'children'> & {
  className?: string
  children?: ReactNode
}

/** Nome e descrição da tabela, lidos antes do conteúdo por leitores de tela. */
export function TableCaption({ className, children, ...props }: TableCaptionProps) {
  return (
    <View className={cn('pb-3', className)} {...props}>
      <CellContent className="text-sm text-text-secondary">{children}</CellContent>
    </View>
  )
}

export type TableHeaderProps = ViewProps & { className?: string }

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <View className={cn('bg-bg-secondary', className)} {...props} />
}

export type TableBodyProps = ViewProps & { className?: string }

export function TableBody({ className, ...props }: TableBodyProps) {
  return <View className={className} {...props} />
}

export type TableRowProps = ViewProps & { className?: string }

export function TableRow({ className, ...props }: TableRowProps) {
  return <View className={cn('flex-row border-b border-border-default', className)} {...props} />
}

export type TableHeadProps = Omit<ViewProps, 'children'> & {
  className?: string
  children?: ReactNode
}

/** Célula de cabeçalho. RN não tem `aria-sort`: indique a ordenação no próprio conteúdo. */
export function TableHead({ className, children, ...props }: TableHeadProps) {
  return (
    <View
      accessible
      accessibilityRole="header"
      className={cn('min-w-24 flex-1 px-4 py-3', className)}
      {...props}
    >
      <CellContent className="text-xs font-medium text-text-secondary">{children}</CellContent>
    </View>
  )
}

export type TableCellProps = Omit<ViewProps, 'children'> & {
  className?: string
  children?: ReactNode
}

export function TableCell({ className, children, ...props }: TableCellProps) {
  return (
    <View className={cn('min-w-24 flex-1 px-4 py-3', className)} {...props}>
      <CellContent className="text-sm text-text-primary">{children}</CellContent>
    </View>
  )
}
