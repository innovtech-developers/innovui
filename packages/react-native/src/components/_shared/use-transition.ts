import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import { useReducedMotion } from './sliding-indicator'

type Options = {
  /** Duração da entrada (ms). */
  duration?: number
  /** Duração da saída (ms). */
  exitDuration?: number
  /** Chamado quando a saída termina e o conteúdo é desmontado. */
  onClosed?: () => void
}

/**
 * Entrada e saída de um overlay: `progress` vai de 0 a 1 (nativo, sem passar pelo JS) e `mounted`
 * mantém o conteúdo na tela até a saída terminar (o `Modal` nativo só é fechado depois). Com
 * "Reduzir movimento" ligado no sistema, abre e fecha direto.
 */
export function useTransition(
  isOpen: boolean,
  { duration = 200, exitDuration = 150, onClosed }: Options = {},
) {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(isOpen)
  const progress = useRef(new Animated.Value(isOpen ? 1 : 0)).current
  const closed = useRef(onClosed)
  closed.current = onClosed

  useEffect(() => {
    if (isOpen) setMounted(true)
    if (reduced) {
      progress.setValue(isOpen ? 1 : 0)
      if (!isOpen) {
        setMounted(false)
        closed.current?.()
      }
      return
    }
    const animation = Animated.timing(progress, {
      toValue: isOpen ? 1 : 0,
      duration: isOpen ? duration : exitDuration,
      useNativeDriver: true,
    })
    animation.start(({ finished }) => {
      if (finished && !isOpen) {
        setMounted(false)
        closed.current?.()
      }
    })
    return () => animation.stop()
  }, [isOpen, reduced, duration, exitDuration, progress])

  return { mounted, progress }
}
