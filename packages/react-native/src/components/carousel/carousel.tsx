/// <reference types="uniwind/types" />

import { Children, type ReactNode, useRef, useState } from 'react'
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  type ViewProps,
} from 'react-native'
import { cn } from '../../utils/cn'
import { NextIcon, PreviousIcon } from '../_shared/media-icons'
import { useToken } from '../_shared/use-token'
import { IconButton } from '../icon-button'

const GAP = 16
const TABLET = 768

export type CarouselProps = Omit<ViewProps, 'children' | 'style'> & {
  className?: string
  /** Nome acessível do carrossel (ex.: "Modelos de mensagem"). */
  label: string
  /** Os itens: use `CarouselItem`. */
  children: ReactNode
  /** Mostra os pontos de posição. Padrão: `true`. */
  showDots?: boolean
  /** Mostra as setas anterior/próximo. Padrão: `true`. */
  showArrows?: boolean
  /** Largura de cada item, de 0 a 1 da largura do carrossel. Padrão: 0.78 no celular e 0.52 a partir de 768px de tela. */
  itemRatio?: number
  /** Chamado com o índice do item em destaque sempre que ele muda. */
  onIndexChange?: (index: number) => void
  previousLabel?: string
  nextLabel?: string
  /** Monta o nome acessível de cada ponto. Padrão: "Ir para o item N". */
  dotLabel?: (index: number) => string
}

/**
 * Fileira de itens que desliza com o dedo e encaixa item a item, com pontos e setas. Mostra um
 * pedaço do próximo item. O último item "chega ao fim" mesmo que não caiba alinhado à esquerda:
 * o ponto e a seta refletem isso.
 */
export function Carousel({
  className,
  label,
  children,
  showDots = true,
  showArrows = true,
  itemRatio,
  onIndexChange,
  previousLabel = 'Item anterior',
  nextLabel = 'Próximo item',
  dotLabel = (index) => `Ir para o item ${index + 1}`,
  ...props
}: CarouselProps) {
  const items = Children.toArray(children)
  const count = items.length
  const scroll = useRef<ScrollView>(null)
  const { width: screen } = useWindowDimensions()
  const [width, setWidth] = useState(0)
  const [active, setActive] = useState(0)
  const arrowColor = useToken('--color-text-primary')
  const arrowDisabled = useToken('--color-button-disabled-text')

  const itemWidth = width * (itemRatio ?? (screen >= TABLET ? 0.52 : 0.78))
  const step = itemWidth + GAP
  const max = Math.max(count * step - GAP - width, 0)
  // o último ponto de encaixe é o fim da rolagem, mesmo que o último item não chegue à esquerda
  const offsets = Array.from({ length: count }, (_, i) => Math.min(i * step, max))

  function indexAt(x: number) {
    if (max > 0 && x >= max - 1) return count - 1
    let best = 0
    offsets.forEach((offset, i) => {
      if (Math.abs(offset - x) < Math.abs((offsets[best] ?? 0) - x)) best = i
    })
    return best
  }

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = indexAt(event.nativeEvent.contentOffset.x)
    if (next === active) return
    setActive(next)
    onIndexChange?.(next)
  }

  function goTo(index: number) {
    const target = Math.min(Math.max(index, 0), count - 1)
    scroll.current?.scrollTo({ x: offsets[target] ?? 0, animated: true })
  }

  return (
    <View className={cn('gap-6', className)} {...props}>
      <ScrollView
        ref={scroll}
        horizontal
        accessibilityLabel={label}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToOffsets={offsets}
        scrollEventThrottle={16}
        onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
        onScroll={onScroll}
        contentContainerClassName="gap-4"
      >
        {items.map((child, i) => (
          <View
            // biome-ignore lint/suspicious/noArrayIndexKey: os itens são posicionais
            key={i}
            accessibilityLabel={`${i + 1} de ${count}`}
            style={{ width: itemWidth }}
          >
            {child}
          </View>
        ))}
      </ScrollView>
      {(showDots || showArrows) && count > 0 && (
        <View className="flex-row items-center justify-between">
          {showDots ? (
            <View className="flex-row items-center gap-2">
              {items.map((_, i) => (
                <Pressable
                  // biome-ignore lint/suspicious/noArrayIndexKey: os pontos são posicionais
                  key={i}
                  accessibilityRole="button"
                  accessibilityLabel={dotLabel(i)}
                  accessibilityState={{ selected: i === active }}
                  onPress={() => goTo(i)}
                  className="h-11 items-center justify-center"
                >
                  <View
                    className={cn(
                      'h-2 rounded-full',
                      i === active ? 'w-6 bg-interactive-primary' : 'w-2 bg-border-strong',
                    )}
                  />
                </Pressable>
              ))}
            </View>
          ) : (
            <View />
          )}
          {showArrows && (
            <View className="flex-row gap-2">
              <IconButton
                accessibilityLabel={previousLabel}
                variant="tertiary"
                disabled={active <= 0}
                onPress={() => goTo(active - 1)}
              >
                <PreviousIcon color={active <= 0 ? arrowDisabled : arrowColor} />
              </IconButton>
              <IconButton
                accessibilityLabel={nextLabel}
                variant="tertiary"
                disabled={active >= count - 1}
                onPress={() => goTo(active + 1)}
              >
                <NextIcon color={active >= count - 1 ? arrowDisabled : arrowColor} />
              </IconButton>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

/** Um item do `Carousel`. A largura vem do carrossel (`itemRatio`); o item preenche toda a altura. */
export function CarouselItem({
  className,
  ...props
}: Omit<ViewProps, 'style'> & { className?: string }) {
  return <View className={cn('flex-1', className)} {...props} />
}
