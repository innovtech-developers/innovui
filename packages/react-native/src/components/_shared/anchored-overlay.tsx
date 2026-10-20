/// <reference types="uniwind/types" />

import { type ReactNode, type RefObject, useCallback, useRef, useState } from 'react'
import { Modal, Pressable, useWindowDimensions, View } from 'react-native'

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
  dismissOnPressOutside = true,
  className,
  testID,
}: AnchoredOverlayProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  if (!rect) return null

  const spaceBelow = windowHeight - (rect.y + rect.height)
  const spaceAbove = rect.y
  const wantsTop = placement === 'top'
  const goTop = wantsTop
    ? spaceAbove >= estimatedHeight || spaceAbove >= spaceBelow
    : spaceBelow < estimatedHeight && spaceAbove > spaceBelow

  const left = Math.max(8, Math.min(rect.x, windowWidth - 8 - (matchAnchorWidth ? rect.width : 0)))

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <Pressable
        accessible={false}
        className="flex-1"
        onPress={dismissOnPressOutside ? onRequestClose : undefined}
        testID={testID ? `${testID}-backdrop` : undefined}
      >
        <View
          testID={testID}
          className={className}
          style={{
            position: 'absolute',
            left,
            ...(goTop
              ? { bottom: windowHeight - rect.y + offset }
              : { top: rect.y + rect.height + offset }),
            ...(matchAnchorWidth ? { width: rect.width } : null),
          }}
          // Toques dentro do conteúdo não chegam ao backdrop.
          onStartShouldSetResponder={() => true}
        >
          {children}
        </View>
      </Pressable>
    </Modal>
  )
}
