/// <reference types="uniwind/types" />

import { Pressable, Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'
import { ChevronRightIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'

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

export type PaginationProps = ViewProps & {
  className?: string
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

function ArrowButton({
  label,
  disabled,
  reversed,
  onPress,
}: {
  label: string
  disabled: boolean
  reversed?: boolean
  onPress: () => void
}) {
  const color = useToken(disabled ? '--color-text-disabled' : '--color-text-primary')

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className="size-9 items-center justify-center rounded-full bg-transparent active:bg-button-secondary-bg-hover"
    >
      {/* Valor dinâmico: a seta anterior é a próxima girada em 180°. */}
      <View style={reversed ? { transform: [{ rotate: '180deg' }] } : undefined}>
        <ChevronRightIcon color={color} />
      </View>
    </Pressable>
  )
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
  accessibilityLabel = 'Paginação',
  ...props
}: PaginationProps) {
  return (
    // RN não tem role "navigation": o nome acessível fica no accessibilityLabel.
    <View
      accessibilityLabel={accessibilityLabel}
      className={cn('flex-row items-center gap-1', className)}
      {...props}
    >
      <ArrowButton
        label={previousLabel}
        reversed
        disabled={page <= 1}
        onPress={() => onPageChange(page - 1)}
      />
      {getPages(page, pageCount, siblingCount).map((item) => {
        if (typeof item === 'string') {
          return (
            <View
              key={item}
              accessible={false}
              importantForAccessibility="no-hide-descendants"
              className="size-9 items-center justify-center"
            >
              <Text className="text-sm text-text-secondary">…</Text>
            </View>
          )
        }
        const current = item === page
        return (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityLabel={`Página ${item}`}
            // RN não tem aria-current: a página atual vai como `selected`.
            accessibilityState={{ selected: current }}
            onPress={() => onPageChange(item)}
            className={cn(
              'size-9 items-center justify-center rounded-full',
              current
                ? 'bg-button-primary-bg active:bg-button-primary-bg-active'
                : 'bg-transparent active:bg-button-secondary-bg-hover',
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                current ? 'text-button-primary-text' : 'text-button-ghost-text',
              )}
            >
              {item}
            </Text>
          </Pressable>
        )
      })}
      <ArrowButton
        label={nextLabel}
        disabled={page >= pageCount}
        onPress={() => onPageChange(page + 1)}
      />
    </View>
  )
}
