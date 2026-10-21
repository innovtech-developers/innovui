/// <reference types="uniwind/types" />

import { useCallback, useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Easing, View } from 'react-native'

export type Rect = { x: number; y: number; width: number; height: number }

/** Posições medidas (`onLayout`) dos itens de um grupo, por chave. */
export function useItemLayouts() {
  const [layouts, setLayouts] = useState<Record<string, Rect>>({})
  const setLayout = useCallback((key: string, rect: Rect) => {
    setLayouts((current) => {
      const before = current[key]
      const same =
        before &&
        before.x === rect.x &&
        before.y === rect.y &&
        before.width === rect.width &&
        before.height === rect.height
      return same ? current : { ...current, [key]: rect }
    })
  }, [])
  return { layouts, setLayout }
}

/** "Reduzir movimento" do sistema: o indicador pula direto em vez de deslizar. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    let alive = true
    // só ligar quando o sistema pede (o padrão é `false`): evita um render à toa em todo overlay
    AccessibilityInfo.isReduceMotionEnabled?.()?.then((value) => alive && value && setReduced(true))
    const subscription = AccessibilityInfo.addEventListener?.('reduceMotionChanged', setReduced)
    return () => {
      alive = false
      subscription?.remove?.()
    }
  }, [])
  return reduced
}

/**
 * Indicador único que desliza e se redimensiona até `target` (o sublinhado das Tabs, o pill do
 * SegmentedControl). Fica no contêiner dos itens, com posição absoluta, e usa as medidas
 * `onLayout` dos itens. Na primeira medição aparece direto no lugar, sem deslizar do canto.
 * A animação é do lado do JS (posição e tamanho são `layout`, que o driver nativo não anima).
 */
export function SlidingIndicator({
  target,
  className,
}: {
  target: Rect | undefined
  /** Classes do desenho (cor, raio, sombra) do indicador, que preenche o retângulo. */
  className?: string
}) {
  const reduced = useReducedMotion()
  const values = useRef<Record<'left' | 'top' | 'width' | 'height', Animated.Value> | null>(null)
  if (target && !values.current) {
    values.current = {
      left: new Animated.Value(target.x),
      top: new Animated.Value(target.y),
      width: new Animated.Value(target.width),
      height: new Animated.Value(target.height),
    }
  }

  const x = target?.x
  const y = target?.y
  const width = target?.width
  const height = target?.height
  useEffect(() => {
    const current = values.current
    if (!current || x === undefined || y === undefined || !width || !height) return
    const to = { left: x, top: y, width, height }
    if (reduced) {
      for (const key of Object.keys(to) as (keyof typeof to)[]) current[key].setValue(to[key])
      return
    }
    const animation = Animated.parallel(
      (Object.keys(to) as (keyof typeof to)[]).map((key) =>
        Animated.timing(current[key], {
          toValue: to[key],
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ),
    )
    animation.start()
    return () => animation.stop()
  }, [x, y, width, height, reduced])

  if (!target || !values.current) return null
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', ...values.current }}>
      <View className={className} style={{ flex: 1 }} />
    </Animated.View>
  )
}
