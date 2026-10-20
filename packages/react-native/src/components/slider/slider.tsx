/// <reference types="uniwind/types" />

import { useRef, useState } from 'react'
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  View,
  type ViewProps,
} from 'react-native'
import { cn } from '../../utils/cn'

export type SliderProps = Omit<ViewProps, 'children' | 'style'> & {
  className?: string
  /** Controlado: `[40]` para um valor, `[20, 80]` para um intervalo. */
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  /** Chamado durante o arraste, a cada mudança de valor. */
  onValueChange?: (value: number[]) => void
  /** Chamado ao soltar a alça (ou após uma ação de acessibilidade). */
  onValueCommit?: (value: number[]) => void
  /** Nome acessível de cada alça, na ordem. Padrão: `accessibilityLabel` (com o número, se houver várias). */
  thumbLabels?: string[]
}

const THUMB = 20

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi)

/**
 * Escolhe um número (ou um intervalo, com dois valores) arrastando a alça ou tocando na barra.
 * No native cada alça é um elemento "adjustable": o leitor de tela ajusta com deslizar para
 * cima/baixo (ações increment/decrement) em vez das setas do teclado.
 */
export function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onValueChange,
  onValueCommit,
  thumbLabels,
  accessibilityLabel,
  accessibilityState,
  ...props
}: SliderProps) {
  const [uncontrolled, setUncontrolled] = useState<number[]>(defaultValue ?? [min])
  const values = value ?? uncontrolled
  const [width, setWidth] = useState(0)
  const active = useRef(0)
  // O arraste lê o valor mais recente sem depender de closures antigas.
  const latest = useRef(values)
  latest.current = values

  const count = values.length
  const usable = Math.max(width - THUMB, 1)
  const range = max - min || 1
  const toPos = (v: number) => ((clamp(v, min, max) - min) / range) * usable

  const snap = (raw: number) => {
    const stepped = min + Math.round((raw - min) / step) * step
    // Evita lixo de ponto flutuante (0.1 + 0.2).
    return clamp(Number(stepped.toFixed(10)), min, max)
  }

  const update = (index: number, raw: number) => {
    const current = latest.current
    // A alça não passa das vizinhas.
    const lo = (index > 0 ? current[index - 1] : undefined) ?? min
    const hi = (index < current.length - 1 ? current[index + 1] : undefined) ?? max
    const next = clamp(snap(raw), lo, hi)
    if (next === current[index]) return
    const nextValues = current.map((v, i) => (i === index ? next : v))
    latest.current = nextValues
    setUncontrolled(nextValues)
    onValueChange?.(nextValues)
  }

  const valueAt = (x: number) => min + (clamp(x - THUMB / 2, 0, usable) / usable) * range

  const onGrant = (event: GestureResponderEvent) => {
    const raw = valueAt(event.nativeEvent.locationX)
    const current = latest.current
    // Alça mais próxima do toque; em empate, a de cima (permite abrir um intervalo colapsado).
    let nearest = 0
    current.forEach((v, i) => {
      if (Math.abs(v - raw) <= Math.abs((current[nearest] ?? min) - raw)) nearest = i
    })
    active.current = nearest
    update(nearest, raw)
  }

  const onAction = (index: number) => (event: AccessibilityActionEvent) => {
    const dir = event.nativeEvent.actionName === 'increment' ? 1 : -1
    update(index, (latest.current[index] ?? min) + dir * step)
    onValueCommit?.(latest.current)
  }

  const labelFor = (i: number) =>
    thumbLabels?.[i] ??
    (count > 1 && accessibilityLabel ? `${accessibilityLabel} ${i + 1}` : accessibilityLabel)

  const start = count > 1 ? toPos(values[0] ?? min) : 0
  const end = toPos(values[count - 1] ?? min)

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => !disabled}
      onMoveShouldSetResponder={() => !disabled}
      onResponderTerminationRequest={() => false}
      onResponderGrant={onGrant}
      onResponderMove={(e) => update(active.current, valueAt(e.nativeEvent.locationX))}
      onResponderRelease={() => onValueCommit?.(latest.current)}
      className={cn('h-11 w-full justify-center', className)}
      {...props}
    >
      {/* Filhos ignoram toques para que `locationX` seja sempre relativo à raiz. */}
      <View pointerEvents="none" className="h-1.5 w-full rounded-full bg-border-default">
        <View
          className={cn(
            'absolute h-full rounded-full bg-interactive-primary',
            disabled && 'bg-interactive-disabled',
          )}
          style={{ left: start + THUMB / 2, width: end - start }}
        />
      </View>
      {values.map((v, i) => (
        <View
          // biome-ignore lint/suspicious/noArrayIndexKey: as alças são posicionais e a ordem nunca muda
          key={i}
          pointerEvents="none"
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={labelFor(i)}
          accessibilityValue={{ min, max, now: v }}
          accessibilityState={{ ...accessibilityState, disabled }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={disabled ? undefined : onAction(i)}
          className={cn(
            'absolute top-3 size-5 rounded-full border-2 border-interactive-primary bg-bg-primary shadow-sm',
            disabled && 'border-interactive-disabled',
          )}
          style={{ left: toPos(v) }}
        />
      ))}
    </View>
  )
}
