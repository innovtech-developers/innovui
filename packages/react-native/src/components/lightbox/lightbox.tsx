/// <reference types="uniwind/types" />

import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  FlatList,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Modal as RNModal,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { Backdrop } from '../_shared/backdrop'
import { NextIcon, PreviousIcon } from '../_shared/media-icons'
import { useOpenState } from '../_shared/overlay-state'
import { CloseIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'
import { useTransition } from '../_shared/use-transition'
import { IconButton } from '../icon-button'

export type LightboxItem = {
  /** Endereço da imagem ampliada. */
  src: string
  /** Descrição da imagem para leitores de tela. */
  alt: string
}

export type LightboxProps = {
  items: LightboxItem[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Índice da imagem exibida (modo controlado). */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Nome acessível do visualizador. */
  label?: string
  closeLabel?: string
  previousLabel?: string
  nextLabel?: string
  testID?: string
}

const roundButton = 'rounded-full border-border-default bg-surface-elevated active:bg-bg-secondary'

/**
 * Imagem ampliada sobre um fundo escurecido, com contador (`1 / 6`), setas e fechar. Deslize para
 * os lados para trocar de foto; as setas dão a volta (da última vai para a primeira).
 */
export function Lightbox({
  items,
  open,
  defaultOpen,
  onOpenChange,
  index,
  defaultIndex = 0,
  onIndexChange,
  label = 'Visualizador de imagens',
  closeLabel = 'Fechar',
  previousLabel = 'Foto anterior',
  nextLabel = 'Próxima foto',
  testID,
}: LightboxProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange })
  const { mounted, progress } = useTransition(isOpen)
  const { width, height } = useWindowDimensions()
  const iconColor = useToken('--color-text-primary')
  const list = useRef<FlatList<LightboxItem>>(null)
  const [inner, setInner] = useState(defaultIndex)
  const count = items.length
  const current = Math.min(Math.max(index ?? inner, 0), Math.max(count - 1, 0))
  // índice em que a lista está de fato, para só rolar quando o pai troca `index` por fora
  const shown = useRef(current)

  function show(next: number) {
    shown.current = next
    if (index === undefined) setInner(next)
    onIndexChange?.(next)
  }

  function go(next: number) {
    const wrapped = (next + count) % count
    list.current?.scrollToIndex({ index: wrapped, animated: true })
    show(wrapped)
  }

  useEffect(() => {
    if (!mounted || shown.current === current) return
    shown.current = current
    list.current?.scrollToIndex({ index: current, animated: false })
  }, [current, mounted])

  function onMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(event.nativeEvent.contentOffset.x / width)
    if (next !== shown.current && next >= 0 && next < count) show(next)
  }

  return (
    <RNModal
      transparent
      statusBarTranslucent
      animationType="none"
      visible={mounted}
      onRequestClose={() => setOpen(false)}
    >
      <View className="flex-1" accessibilityViewIsModal accessibilityLabel={label} testID={testID}>
        <Animated.View
          pointerEvents="box-none"
          style={[StyleSheet.absoluteFill, { opacity: progress }]}
        >
          <Backdrop onPress={() => setOpen(false)} />
        </Animated.View>
        <Animated.View
          pointerEvents="box-none"
          style={[StyleSheet.absoluteFill, { opacity: progress, justifyContent: 'center' }]}
        >
          <FlatList
            ref={list}
            data={items}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.src}
            initialScrollIndex={current}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            onMomentumScrollEnd={onMomentumScrollEnd}
            renderItem={({ item }) => (
              <View style={{ width, height: height * 0.7, paddingHorizontal: 16 }}>
                <Image
                  source={{ uri: item.src }}
                  accessibilityLabel={item.alt}
                  resizeMode="contain"
                  className="size-full"
                />
              </View>
            )}
          />
          {count > 1 && (
            <>
              <View
                pointerEvents="box-none"
                className="absolute inset-x-3 flex-row justify-between"
                style={{ top: height / 2 - 22 }}
              >
                <IconButton
                  accessibilityLabel={previousLabel}
                  variant="tertiary"
                  className={roundButton}
                  onPress={() => go(shown.current - 1)}
                >
                  <PreviousIcon color={iconColor} />
                </IconButton>
                <IconButton
                  accessibilityLabel={nextLabel}
                  variant="tertiary"
                  className={roundButton}
                  onPress={() => go(shown.current + 1)}
                >
                  <NextIcon color={iconColor} />
                </IconButton>
              </View>
              <Text
                accessibilityLiveRegion="polite"
                className="absolute bottom-12 self-center text-sm font-medium leading-5 text-media-on-surface"
              >
                {current + 1} / {count}
              </Text>
            </>
          )}
          <IconButton
            accessibilityLabel={closeLabel}
            variant="tertiary"
            className={`absolute right-4 top-12 ${roundButton}`}
            onPress={() => setOpen(false)}
          >
            <CloseIcon color={iconColor} />
          </IconButton>
        </Animated.View>
      </View>
    </RNModal>
  )
}
