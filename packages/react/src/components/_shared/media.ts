'use client'

import {
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'

/** `83` → `1:23`; com hora, `3725` → `1:02:05`. Valores inválidos viram `0:00`. */
export function formatTime(seconds: number) {
  const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = String(total % 60).padStart(2, '0')
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${secs}` : `${minutes}:${secs}`
}

export type PlaybackState = {
  playing: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
}

const EVENTS = [
  'play',
  'pause',
  'ended',
  'timeupdate',
  'seeking',
  'seeked',
  'loadedmetadata',
  'durationchange',
  'volumechange',
  'emptied',
] as const

const read = (el: HTMLMediaElement): PlaybackState => ({
  playing: !el.paused && !el.ended,
  currentTime: el.currentTime || 0,
  duration: Number.isFinite(el.duration) ? el.duration : 0,
  volume: el.volume,
  muted: el.muted,
})

/** Espelha o estado de um `<audio>`/`<video>` em React, ouvindo os eventos do próprio elemento. */
export function useMediaPlayback(ref: RefObject<HTMLMediaElement | null>) {
  const [state, setState] = useState<PlaybackState>({
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const sync = () => {
      const next = read(el)
      setState((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }
    for (const name of EVENTS) el.addEventListener(name, sync)
    sync()
    return () => {
      for (const name of EVENTS) el.removeEventListener(name, sync)
    }
  }, [ref])

  return state
}

/** Alterna play/pause; o `play()` pode ser recusado pelo navegador (autoplay), o que é ignorado. */
export function togglePlayback(el: HTMLMediaElement | null) {
  if (!el) return
  if (el.paused) Promise.resolve(el.play()).catch(() => {})
  else el.pause()
}

const SEEK_STEP = 5

/**
 * Props de um controle de posição para clicar/arrastar e usar o teclado (setas ±5s, Home, End).
 * Espalhe no elemento da barra, que precisa de `role="slider"` e `aria-label`.
 */
export function useSeek({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}) {
  const dragging = useRef(false)

  function seekAt(el: HTMLElement, clientX: number) {
    const rect = el.getBoundingClientRect()
    if (!rect.width || !duration) return
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
    onSeek(ratio * duration)
  }

  return {
    tabIndex: 0,
    'aria-valuemin': 0,
    'aria-valuemax': Math.round(duration),
    'aria-valuenow': Math.round(currentTime),
    'aria-valuetext': `${formatTime(currentTime)} de ${formatTime(duration)}`,
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.button !== 0) return
      dragging.current = true
      event.currentTarget.setPointerCapture?.(event.pointerId)
      seekAt(event.currentTarget, event.clientX)
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (dragging.current) seekAt(event.currentTarget, event.clientX)
    },
    onPointerUp() {
      dragging.current = false
    },
    onPointerCancel() {
      dragging.current = false
    },
    onKeyDown(event: KeyboardEvent<HTMLElement>) {
      const target =
        event.key === 'ArrowRight' || event.key === 'ArrowUp'
          ? currentTime + SEEK_STEP
          : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
            ? currentTime - SEEK_STEP
            : event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? duration
                : null
      if (target === null) return
      event.preventDefault()
      onSeek(Math.min(Math.max(target, 0), duration))
    },
  } as const
}
