import { useState } from 'react'
import type {
  AccessibilityActionEvent,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native'

/** `83` → `1:23`; com hora, `3725` → `1:02:05`. Valores inválidos viram `0:00`. */
export function formatTime(seconds: number) {
  const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = String(total % 60).padStart(2, '0')
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${secs}` : `${minutes}:${secs}`
}

/** Alturas das barras do Figma (6–34px), como picos de 0 a 1. É a onda padrão do AudioPlayer. */
export const DEFAULT_WAVEFORM = [
  6, 18, 34, 20, 12, 22, 16, 26, 20, 14, 28, 18, 34, 22, 16, 24, 20, 14, 18, 26, 16, 30, 22, 12, 34,
  18, 26, 16, 10, 22, 14, 20, 24, 16, 28, 12, 34, 18, 26, 16, 10, 20, 14, 18, 24, 30, 22, 28, 34,
  16, 24, 18,
].map((height) => (height - 6) / 28)

/** Leva uma lista de picos para `bars` barras (pega o maior de cada trecho, ou repete se faltar). */
export function resamplePeaks(peaks: number[], bars: number) {
  if (peaks.length === bars || peaks.length === 0) return peaks
  return Array.from({ length: bars }, (_, i) => {
    const start = Math.floor((i * peaks.length) / bars)
    const end = Math.max(Math.floor(((i + 1) * peaks.length) / bars), start + 1)
    return Math.max(...peaks.slice(start, end))
  })
}

const SEEK_STEP = 5

/**
 * Props de uma barra de posição: tocar e arrastar posicionam, e o leitor de tela ajusta de 5 em
 * 5 segundos (ações increment/decrement, como no Slider). Espalhe numa `View` cujos filhos têm
 * `pointerEvents="none"`, para o `locationX` ser sempre relativo a ela.
 */
export function useSeek({
  position,
  duration,
  label,
  onSeek,
}: {
  position: number
  duration: number
  label: string
  onSeek?: (seconds: number) => void
}) {
  const [width, setWidth] = useState(0)
  const clamp = (value: number) => Math.min(Math.max(value, 0), duration)
  const at = (x: number) => (width ? clamp((x / width) * duration) : 0)

  return {
    width,
    props: {
      onLayout: (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width),
      onStartShouldSetResponder: () => duration > 0,
      onMoveShouldSetResponder: () => duration > 0,
      onResponderTerminationRequest: () => false,
      onResponderGrant: (event: GestureResponderEvent) => onSeek?.(at(event.nativeEvent.locationX)),
      onResponderMove: (event: GestureResponderEvent) => onSeek?.(at(event.nativeEvent.locationX)),
      accessible: true,
      accessibilityRole: 'adjustable' as const,
      accessibilityLabel: label,
      accessibilityValue: {
        min: 0,
        max: Math.round(duration),
        now: Math.round(position),
        text: `${formatTime(position)} de ${formatTime(duration)}`,
      },
      accessibilityActions: [{ name: 'increment' }, { name: 'decrement' }],
      onAccessibilityAction: (event: AccessibilityActionEvent) => {
        const direction = event.nativeEvent.actionName === 'increment' ? 1 : -1
        onSeek?.(clamp(position + direction * SEEK_STEP))
      },
    },
  }
}
