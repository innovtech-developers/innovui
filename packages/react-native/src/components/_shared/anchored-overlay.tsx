/// <reference types="uniwind/types" />

import { type ReactNode, type RefObject, useCallback, useRef, useState } from 'react'
import { Animated, Modal, Pressable, useWindowDimensions, View } from 'react-native'
import { useTransition } from './use-transition'

export type Placement = 'bottom' | 'top'
type Rect = { x: number; y: number; width: number; height: number }

/**
 * Medição de um gatilho para ancorar um overlay (Popover, Menu, Select, Combobox, DatePicker,
 * Tooltip). `open()` mede o gatilho na janela e só então abre.
 *
 *   const { ref, rect, visible, open, close } = useAnchor()
 *   <View ref={ref} collapsable={false}> ...gatilho... </View>
 *   <AnchoredOverlay visible={visible} rect={rect} onRequestClose={close}> ... </AnchoredOverlay>
 */
export function useAnchor() {
  const ref = useRef<View>(null)
  const [rect, setRect] = useState<Rect | null>(null)
  const [visible, setVisible] = useState(false)

  const open = useCallback(() => {
    const node = ref.current
    if (!node) return
    node.measureInWindow((x, y, width, height) => {
      setRect({ x, y, width, height })
      setVisible(true)
    })
  }, [])
  const close = useCallback(() => setVisible(false), [])

  return { ref: ref as RefObject<View>, rect, visible, open, close }
}

export type AnchoredOverlayProps = {
  visible: boolean
  rect: Rect | null
  onRequestClose: () => void
  children: ReactNode
  /** Lado preferido; inverte se não couber. Padrão: `bottom`. */
  placement?: Placement
  /** Distância do gatilho. Padrão: 4. */
  offset?: number
  /** Largura do conteúdo: `anchor` iguala à do gatilho (Select, Combobox). Padrão: automática. */
  matchAnchorWidth?: boolean
  /** Altura máxima estimada do conteúdo, para decidir a inversão. Padrão: 320. */
  estimatedHeight?: number
  /** Alinhamento com o gatilho: `start` (borda esquerda) ou `center` (centrado, como o Tooltip). */
  align?: 'start' | 'center'
  /** Seta apontando para o gatilho (classes do desenho, ex.: a cor do fundo do conteúdo). */
  arrowClassName?: string
  /** Toque fora fecha. Padrão: true. */
  dismissOnPressOutside?: boolean
  className?: string
  testID?: string
}

/** Overlay transparente, posicionado junto ao gatilho, dentro de um Modal nativo (fica acima de tudo). */
export function AnchoredOverlay({
  visible,
  rect,
  onRequestClose,
  children,
  placement = 'bottom',
  offset = 4,
  matchAnchorWidth = false,
  estimatedHeight = 320,
  align = 'start',
  arrowClassName,
  dismissOnPressOutside = true,
  className,
  testID,
}: AnchoredOverlayProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  // Como no web: fade com zoom de 96% a partir do gatilho (o `Modal` nativo só fecha depois da saída)
  const { mounted, progress } = useTransition(visible, { duration: 150, exitDuration: 100 })
  // centrado precisa da largura do conteúdo: mede e só então mostra
  const [contentWidth, setContentWidth] = useState(0)
  if (!rect) return null

  const spaceBelow = windowHeight - (rect.y + rect.height)
  const spaceAbove = rect.y
  const wantsTop = placement === 'top'
  const goTop = wantsTop
    ? spaceAbove >= estimatedHeight || spaceAbove >= spaceBelow
    : spaceBelow < estimatedHeight && spaceAbove > spaceBelow

  const anchorCenter = rect.x + rect.width / 2
  const left =
    align === 'center'
      ? Math.max(8, Math.min(anchorCenter - contentWidth / 2, windowWidth - 8 - contentWidth))
      : Math.max(8, Math.min(rect.x, windowWidth - 8 - (matchAnchorWidth ? rect.width : 0)))
  const measured = align !== 'center' || contentWidth > 0
  // seta de 6px girada 45° (um losango de ~8px de largura e ~4px para fora), sobre a borda do conteúdo
  const arrowLeft = Math.max(8, Math.min(anchorCenter - left, Math.max(contentWidth, 16) - 8)) - 3

  return (
    <Modal
      transparent
      visible={mounted}
      animationType="none"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <Pressable
        accessible={false}
        className="flex-1"
        onPress={dismissOnPressOutside ? onRequestClose : undefined}
        testID={testID ? `${testID}-backdrop` : undefined}
      >
        <Animated.View
          style={{
            position: 'absolute',
            left,
            ...(goTop
              ? { bottom: windowHeight - rect.y + offset }
              : { top: rect.y + rect.height + offset }),
            ...(matchAnchorWidth ? { width: rect.width } : null),
            opacity: measured ? progress : 0,
            transform: [
              { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
            ],
            transformOrigin: goTop ? 'bottom left' : 'top left',
          }}
          onLayout={(e) => align === 'center' && setContentWidth(e.nativeEvent.layout.width)}
        >
          <View
            testID={testID}
            className={className}
            // Toques dentro do conteúdo não chegam ao backdrop.
            onStartShouldSetResponder={() => true}
          >
            {children}
          </View>
          {arrowClassName && (
            <View
              pointerEvents="none"
              className={`absolute size-1.5 rotate-45 ${arrowClassName}`}
              style={{ left: arrowLeft, ...(goTop ? { bottom: -3 } : { top: -3 }) }}
            />
          )}
        </Animated.View>
      </Pressable>
    </Modal>
  )
}
