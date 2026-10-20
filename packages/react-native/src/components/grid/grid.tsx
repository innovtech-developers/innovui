/// <reference types="uniwind/types" />

import { createContext, useContext, useState } from 'react'
import { type LayoutChangeEvent, useWindowDimensions, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

const TABLET_MIN_WIDTH = 768
const DESKTOP_MIN_WIDTH = 1440

// escala de gap do DS (base 4): chave -> px
const gapPx = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 } as const

type Columns = 'responsive' | 1 | 2 | 3 | 4 | 6 | 12
type Gap = keyof typeof gapPx

type GridContextValue = { columns: number; gap: number; width: number }
const GridContext = createContext<GridContextValue>({ columns: 1, gap: 0, width: 0 })

export type GridProps = ViewProps & {
  className?: string
  /** `responsive` segue o grid do DS: 4 colunas, 8 a partir de 768px e 12 a partir de 1440px. */
  columns?: Columns
  /** Espaçamento entre células, na escala do DS (px = valor x 4). */
  gap?: Gap
}

/**
 * Grid de colunas iguais. Não há CSS grid no RN: a largura de cada `GridItem` é calculada a
 * partir da largura medida do Grid (`onLayout`) e as células quebram linha com `flex-wrap`.
 * Antes da primeira medição, usa porcentagem (sem descontar o gap).
 */
export function Grid({
  className,
  columns = 'responsive',
  gap = 4,
  onLayout,
  children,
  ...props
}: GridProps) {
  const { width: windowWidth } = useWindowDimensions()
  const [width, setWidth] = useState(0)

  const count =
    columns === 'responsive'
      ? windowWidth >= DESKTOP_MIN_WIDTH
        ? 12
        : windowWidth >= TABLET_MIN_WIDTH
          ? 8
          : 4
      : columns

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width)
    onLayout?.(event)
  }

  return (
    <GridContext.Provider value={{ columns: count, gap: gapPx[gap], width }}>
      <View
        className={cn('flex-row flex-wrap', className)}
        style={{ gap: gapPx[gap] }}
        onLayout={handleLayout}
        {...props}
      >
        {children}
      </View>
    </GridContext.Provider>
  )
}

export type GridItemProps = ViewProps & {
  className?: string
  /** Quantas colunas a célula ocupa (`full` ocupa a linha toda). Padrão: 1. */
  span?: 1 | 2 | 3 | 4 | 6 | 8 | 12 | 'full'
}

/** Célula do Grid que ocupa `span` colunas (limitado ao total de colunas atual). */
export function GridItem({ className, span = 1, style, ...props }: GridItemProps) {
  const { columns, gap, width } = useContext(GridContext)
  const n = span === 'full' ? columns : Math.min(span, columns)

  const itemWidth =
    width > 0
      ? (width - gap * (columns - 1)) * (n / columns) + gap * (n - 1)
      : `${(n / columns) * 100}%`

  return (
    <View className={cn(className)} style={[{ width: itemWidth as number }, style]} {...props} />
  )
}
