/// <reference types="uniwind/types" />

import { useState } from 'react'
import {
  Image,
  type LayoutChangeEvent,
  Pressable,
  useWindowDimensions,
  View,
  type ViewProps,
} from 'react-native'
import { cn } from '../../utils/cn'
import { ExpandIcon } from '../_shared/media-icons'
import { useToken } from '../_shared/use-token'
import { Lightbox, type LightboxItem } from '../lightbox'

const GAP = 8
const TABLET = 768

export type GalleryItem = LightboxItem & {
  /** Imagem menor para a grade; sem ela, a grade usa `src`. */
  thumbSrc?: string
}

export type GalleryProps = Omit<ViewProps, 'children' | 'style'> & {
  className?: string
  items: GalleryItem[]
  /** Colunas da grade. Padrão: 2 no celular e 3 a partir de 768px de tela. */
  columns?: number
  /** Nome acessível do botão de cada miniatura. Padrão: "Ampliar foto N: descrição". */
  openLabel?: (item: GalleryItem, index: number) => string
  /** Nome acessível do visualizador ampliado. */
  lightboxLabel?: string
}

/** Grade de miniaturas que abre a foto ampliada no `Lightbox`. */
export function Gallery({
  className,
  items,
  columns,
  openLabel = (item, i) => `Ampliar foto ${i + 1}: ${item.alt}`,
  lightboxLabel,
  ...props
}: GalleryProps) {
  const { width: screen } = useWindowDimensions()
  const [width, setWidth] = useState(0)
  const [opened, setOpened] = useState<number | null>(null)
  const overlayColor = useToken('--color-media-on-surface')
  const cols = columns ?? (screen >= TABLET ? 3 : 2)
  const size = (width - GAP * (cols - 1)) / cols

  return (
    <>
      <View
        className={cn('flex-row flex-wrap gap-2', className)}
        onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
        {...props}
      >
        {items.map((item, i) => (
          <Pressable
            key={item.src}
            accessibilityRole="imagebutton"
            accessibilityLabel={openLabel(item, i)}
            onPress={() => setOpened(i)}
            className="overflow-hidden rounded-md bg-bg-skeleton"
            style={{ width: size, aspectRatio: 4 / 3 }}
          >
            {({ pressed }) => (
              <>
                <Image
                  source={{ uri: item.thumbSrc ?? item.src }}
                  className="size-full"
                  resizeMode="cover"
                />
                {pressed && (
                  <View
                    pointerEvents="none"
                    className="absolute inset-0 items-center justify-center bg-media-surface/50"
                  >
                    <ExpandIcon color={overlayColor} />
                  </View>
                )}
              </>
            )}
          </Pressable>
        ))}
      </View>
      <Lightbox
        items={items}
        label={lightboxLabel}
        open={opened !== null}
        onOpenChange={(open) => !open && setOpened(null)}
        index={opened ?? 0}
        onIndexChange={setOpened}
      />
    </>
  )
}
