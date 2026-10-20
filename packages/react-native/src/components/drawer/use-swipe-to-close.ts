import { useCallback, useMemo, useRef, useState } from 'react'
import {
  Animated,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  PanResponder,
} from 'react-native'

export type Side = 'top' | 'right' | 'bottom' | 'left'

/** Eixo do arraste e sinal do movimento do dedo que fecha (em direção à borda do `side`). */
const closing = {
  right: { axis: 'x', sign: 1 },
  left: { axis: 'x', sign: -1 },
  bottom: { axis: 'y', sign: 1 },
  top: { axis: 'y', sign: -1 },
} as const

/** Fração do painel que precisa sair, ou a velocidade (px/ms) do gesto, para soltar e fechar. */
export const CLOSE_DISTANCE = 0.4
export const CLOSE_VELOCITY = 0.5
/** Movimento mínimo (px) antes de o painel tomar o gesto. */
const SLOP = 6

type Options = {
  side: Side
  enabled: boolean
  /** Tamanho de reserva (px) do painel no eixo do arraste, até o `onLayout` medir. */
  fallbackSize: number
  onClose: () => void
  /** O painel ainda está aberto? (controlado, o `onClose` pode ser ignorado: aí o painel volta). */
  isOpen: () => boolean
}

/**
 * Fecha o painel arrastando-o para a borda de onde ele veio (mesmo comportamento do web).
 *
 * `PanResponder` na fase de captura, para tomar o gesto do `ScrollView` do corpo, mas só quando o
 * dedo vai no sentido de fechar, o gesto é mais ao longo do eixo do que de lado e o corpo não rola
 * mais naquele sentido (no `bottom`, rolagem no topo; no `top`, no fim). Como a captura é refeita a
 * cada movimento, um gesto que começou rolando passa ao painel quando o conteúdo chega à borda; o
 * arraste conta daí (o grant zera `dx`/`dy`), sem salto. O `Slider` não perde o toque: ele não aceita ser
 * tomado (`onResponderTerminationRequest` retorna `false`).
 *
 * Devolve `drag` (px arrastados, ≥ 0) e `dragFade` (1 → 0 conforme o painel sai, para o backdrop),
 * os `panHandlers` do painel, o `onLayout` que mede o painel e as props do `ScrollView` do corpo.
 */
export function useSwipeToClose({ side, enabled, fallbackSize, onClose, isOpen }: Options) {
  const drag = useRef(new Animated.Value(0)).current
  const [panelSize, setPanelSize] = useState(fallbackSize)
  const size = useRef(fallbackSize)
  const scroll = useRef({ offset: 0, content: 0, layout: 0 })
  const state = useRef({ offset: 0 })
  // `PanResponder.create` roda uma vez: o que muda a cada render vai por aqui.
  const latest = useRef({ side, enabled, onClose, isOpen })
  latest.current = { side, enabled, onClose, isOpen }

  const reset = useCallback(() => {
    state.current.offset = 0
    Animated.timing(drag, { toValue: 0, duration: 200, useNativeDriver: true }).start()
  }, [drag])

  const panResponder = useMemo(() => {
    const delta = (dx: number, dy: number) => {
      const { axis, sign } = closing[latest.current.side]
      return { main: (axis === 'x' ? dx : dy) * sign, cross: axis === 'x' ? dy : dx }
    }
    // o corpo ainda rola no sentido de fechar? Então o dedo é da rolagem, não do painel
    const bodyScrolls = () => {
      const { axis } = closing[latest.current.side]
      if (axis === 'x') return false // o corpo rola na vertical
      const { offset, content, layout } = scroll.current
      return latest.current.side === 'bottom' ? offset > 1 : offset + layout < content - 1
    }

    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, g) => {
        if (!latest.current.enabled) return false
        const { main, cross } = delta(g.dx, g.dy)
        if (main <= SLOP || Math.abs(main) <= Math.abs(cross) || bodyScrolls()) return false
        return true
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => {
        const { main } = delta(g.dx, g.dy)
        // o `PanResponder` zera `dx`/`dy` no grant: o arraste conta de onde o painel assumiu
        state.current.offset = Math.max(0, main)
        drag.setValue(state.current.offset)
      },
      onPanResponderRelease: (_, g) => {
        const { axis, sign } = closing[latest.current.side]
        const velocity = (axis === 'x' ? g.vx : g.vy) * sign
        if (state.current.offset > size.current * CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) {
          // a saída continua de onde o painel foi solto; `drag` zera quando o Modal desmonta
          latest.current.onClose()
          requestAnimationFrame(() => latest.current.isOpen() && reset())
        } else reset()
      },
      onPanResponderTerminate: reset,
    })
  }, [drag, reset])

  return {
    drag,
    // o backdrop clareia à medida que o painel sai
    dragFade: drag.interpolate({
      inputRange: [0, Math.max(panelSize, 1)],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
    panHandlers: panResponder.panHandlers,
    onPanelLayout: (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout
      const next = (closing[latest.current.side].axis === 'x' ? width : height) || size.current
      size.current = next
      setPanelSize(next)
    },
    scrollProps: {
      scrollEventThrottle: 16,
      onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        scroll.current.offset = e.nativeEvent.contentOffset.y
        scroll.current.content = e.nativeEvent.contentSize.height
        scroll.current.layout = e.nativeEvent.layoutMeasurement.height
      },
      onContentSizeChange: (_w: number, h: number) => {
        scroll.current.content = h
      },
      onLayout: (e: LayoutChangeEvent) => {
        scroll.current.layout = e.nativeEvent.layout.height
      },
    },
    resetDrag: useCallback(() => drag.setValue(0), [drag]),
  }
}
