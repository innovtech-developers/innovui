'use client'

import { type ComponentProps, useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { formatTime, togglePlayback, useMediaPlayback, useSeek } from '../_shared/media'
import { PauseIcon, PlayIcon } from '../_shared/media-icons'
import { resamplePeaks, useWaveform } from '../_shared/waveform'

// Alturas das barras no Figma: de 6px (silêncio) a 34px (pico).
const BAR_MIN = 6
const BAR_RANGE = 28
// Cada barra tem no mínimo 2px, com 2px de espaço entre elas.
const BAR_SLOT = 4

export type AudioPlayerProps = Omit<
  ComponentProps<'div'>,
  'children' | 'onPlay' | 'onPause' | 'onEnded' | 'onTimeUpdate'
> & {
  /** Endereço do áudio. A onda é extraída dele sozinha. */
  src: string
  /** Nome acessível do player. */
  label?: string
  /** Quantidade de barras da onda. Padrão: 52. */
  bars?: number
  /** Velocidades do botão (cada clique passa para a próxima). Padrão: 1x, 1.5x e 2x. */
  speeds?: number[]
  /**
   * Picos da onda, de 0 a 1. Pula o download e a análise do áudio: use para áudios longos ou de
   * outra origem sem CORS.
   */
  waveform?: number[]
  preload?: 'none' | 'metadata' | 'auto'
  onPlay?: ComponentProps<'audio'>['onPlay']
  onPause?: ComponentProps<'audio'>['onPause']
  onEnded?: ComponentProps<'audio'>['onEnded']
  onTimeUpdate?: ComponentProps<'audio'>['onTimeUpdate']
}

/**
 * Player de áudio com onda: play/pause, posição (clique ou arraste na onda), tempo e velocidade.
 * A onda é calculada a partir do próprio arquivo; enquanto isso as barras pulsam, e se não der
 * (CORS, formato) cai numa onda padrão e o áudio toca normalmente.
 */
export function AudioPlayer({
  className,
  src,
  label = 'Áudio',
  bars = 52,
  speeds = [1, 1.5, 2],
  waveform,
  preload = 'metadata',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  ...props
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { playing, currentTime, duration } = useMediaPlayback(audioRef)
  const peaks = useWaveform(src, bars, waveform)
  const waveRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(bars)
  const [speedIndex, setSpeedIndex] = useState(0)
  const speed = speeds[speedIndex % speeds.length] ?? 1

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    // `defaultPlaybackRate` mantém a velocidade quando o `src` troca
    audio.defaultPlaybackRate = speed
    audio.playbackRate = speed
  }, [speed])

  // Em telas estreitas a onda perde barras, em vez de passar por cima do tempo e da velocidade.
  useEffect(() => {
    const wave = waveRef.current
    if (!wave || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setFit(Math.max(1, Math.floor((entry.contentRect.width + 2) / BAR_SLOT)))
    })
    observer.observe(wave)
    return () => observer.disconnect()
  }, [])
  const shown = Math.min(bars, fit)
  const shownPeaks = peaks && resamplePeaks(peaks, shown)

  const seekProps = useSeek({
    currentTime,
    duration,
    onSeek(time) {
      if (audioRef.current) audioRef.current.currentTime = time
    },
  })
  const progress = duration ? currentTime / duration : 0
  const played = Math.round(progress * shown)
  const controlFocus =
    'iu:outline-none iu:focus-visible:border-2 iu:focus-visible:border-[var(--color-border-focus)]'

  return (
    // biome-ignore lint/a11y/useSemanticElements: <fieldset> traz borda e margens próprias de formulário
    <div
      role="group"
      aria-label={label}
      className={cn(
        'iu:flex iu:w-full iu:max-w-[480px] iu:items-center iu:gap-3 iu:rounded-lg iu:border iu:border-[var(--color-border-default)] iu:bg-[var(--color-surface-elevated)] iu:p-4 iu:shadow-sm',
        className,
      )}
      {...props}
    >
      {/* biome-ignore lint/a11y/useMediaCaption: o áudio tem controles próprios; legenda fica a cargo de quem usa */}
      <audio
        ref={audioRef}
        src={src}
        preload={preload}
        onPlay={onPlay}
        onPause={onPause}
        onTimeUpdate={onTimeUpdate}
        onEnded={(event) => {
          // terminou: volta ao começo, pronto para ouvir de novo
          event.currentTarget.currentTime = 0
          onEnded?.(event)
        }}
      />
      <button
        type="button"
        aria-label={playing ? 'Pausar' : 'Reproduzir'}
        onClick={() => togglePlayback(audioRef.current)}
        className="iu:flex iu:size-11 iu:shrink-0 iu:items-center iu:justify-center iu:rounded-full iu:border-0 iu:border-[var(--color-surface-elevated)] iu:bg-[var(--color-button-primary-bg)] iu:text-[var(--color-media-on-surface)] iu:transition-colors iu:outline-none iu:hover:bg-[var(--color-button-primary-bg-hover)] iu:active:bg-[var(--color-button-primary-bg-active)] iu:focus-visible:border-2 iu:focus-visible:shadow-[0_0_0_4px_var(--color-border-focus)] iu:motion-reduce:transition-none"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className="iu:flex iu:min-w-0 iu:flex-1 iu:items-center iu:gap-2">
        {/* biome-ignore lint/a11y/useFocusableInteractive: tabIndex e aria-value* vêm do useSeek */}
        <div
          {...seekProps}
          ref={waveRef}
          // biome-ignore lint/a11y/useAriaPropsForRole: aria-value* vêm do useSeek
          role="slider"
          aria-label="Posição do áudio"
          aria-busy={peaks === null || undefined}
          className={cn(
            'iu:group/wave iu:relative iu:flex iu:h-[34px] iu:min-w-0 iu:flex-1 iu:cursor-pointer iu:touch-none iu:items-center iu:gap-0.5 iu:rounded-sm iu:outline-none iu:after:pointer-events-none iu:after:absolute iu:after:inset-0 iu:after:rounded-sm iu:after:border-[var(--color-border-strong)] iu:after:content-[""] iu:hover:after:border iu:focus-visible:after:border-2 iu:focus-visible:after:border-[var(--color-border-focus)]',
          )}
        >
          {Array.from({ length: shown }, (_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: as barras são posicionais e fixas
              key={i}
              style={{ height: BAR_MIN + (shownPeaks?.[i] ?? 0) * BAR_RANGE }}
              className={cn(
                'iu:min-w-0.5 iu:flex-1 iu:rounded-full',
                peaks === null && 'iu:animate-pulse iu:motion-reduce:animate-none',
                i < played
                  ? 'iu:bg-[var(--color-button-primary-bg)] iu:group-hover/wave:bg-[var(--color-button-primary-bg-hover)] iu:group-active/wave:bg-[var(--color-button-primary-bg-active)]'
                  : 'iu:bg-[var(--color-media-wave-rest)]',
              )}
            />
          ))}
        </div>
        <span
          aria-hidden="true"
          className="iu:shrink-0 iu:text-xs iu:leading-4 iu:font-medium iu:text-[var(--color-text-secondary)] iu:tabular-nums"
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      <button
        type="button"
        aria-label={`Velocidade de reprodução: ${speed}x`}
        onClick={() => setSpeedIndex((index) => (index + 1) % speeds.length)}
        className={cn(
          'iu:flex iu:h-8 iu:w-16 iu:shrink-0 iu:items-center iu:justify-center iu:rounded-full iu:border iu:border-[var(--color-border-default)] iu:bg-[var(--color-surface-elevated)] iu:text-sm iu:leading-5 iu:font-medium iu:text-[var(--color-text-secondary)] iu:transition-colors iu:hover:border-[var(--color-border-strong)] iu:active:bg-[var(--color-bg-tertiary)] iu:motion-reduce:transition-none',
          controlFocus,
        )}
      >
        {speed}x
      </button>
    </div>
  )
}
