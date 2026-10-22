/// <reference types="uniwind/types" />

import { useState } from 'react'
import { Pressable, Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'
import { DEFAULT_WAVEFORM, formatTime, resamplePeaks, useSeek } from '../_shared/media'
import { PauseIcon, PlayIcon } from '../_shared/media-icons'
import { useToken } from '../_shared/use-token'

// Alturas das barras no Figma: de 6px (silêncio) a 34px (pico).
const BAR_MIN = 6
const BAR_RANGE = 28

export type AudioPlayerProps = Omit<ViewProps, 'children' | 'style'> & {
  className?: string
  /** Nome acessível do player. */
  label?: string
  /** Tocando agora: mostra o botão de pausar. */
  playing?: boolean
  /** Posição atual, em segundos. */
  position?: number
  /** Duração total, em segundos. */
  duration?: number
  /** Velocidade atual (controlado). Sem ela, o player guarda a escolhida. */
  rate?: number
  /** Velocidades do botão (cada toque passa para a próxima). Padrão: 1x, 1.5x e 2x. */
  speeds?: number[]
  /** Picos da onda, de 0 a 1. Sem eles, usa uma onda padrão. */
  waveform?: number[]
  /** Quantidade de barras da onda. Padrão: 52. */
  bars?: number
  onPlayPause?: () => void
  /** Chamado com a posição (em segundos) tocada ou arrastada na onda. */
  onSeek?: (seconds: number) => void
  /** Chamado com a nova velocidade quando o botão é tocado. */
  onRateChange?: (rate: number) => void
}

/**
 * Casca de player de áudio: botão, onda, tempo e velocidade. Não toca nada: quem usa guarda o
 * estado (por exemplo com `expo-audio`) e o passa por props, ligando `onPlayPause`, `onSeek` e
 * `onRateChange` ao player de verdade.
 */
export function AudioPlayer({
  className,
  label = 'Áudio',
  playing = false,
  position = 0,
  duration = 0,
  rate,
  speeds = [1, 1.5, 2],
  waveform,
  bars = 52,
  onPlayPause,
  onSeek,
  onRateChange,
  onLayout,
  ...props
}: AudioPlayerProps) {
  const [chosen, setChosen] = useState(speeds[0] ?? 1)
  const [cardWidth, setCardWidth] = useState(0)
  // abaixo de 416px (26rem) o tempo desce para baixo da onda, que ganha a largura toda
  const stacked = cardWidth > 0 && cardWidth < 416
  const speed = rate ?? chosen
  const iconColor = useToken('--color-media-on-surface')
  const seek = useSeek({ position, duration, label: 'Posição do áudio', onSeek })
  // Em telas estreitas a onda perde barras (2px + 2px de espaço), em vez de invadir o tempo.
  const shown = seek.width ? Math.min(bars, Math.max(1, Math.floor((seek.width + 2) / 4))) : bars
  const peaks = resamplePeaks(waveform ?? DEFAULT_WAVEFORM, shown)
  const played = duration ? Math.round((position / duration) * shown) : 0

  function nextSpeed() {
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length] ?? 1
    setChosen(next)
    onRateChange?.(next)
  }

  return (
    <View
      accessibilityLabel={label}
      onLayout={(event) => {
        setCardWidth(event.nativeEvent.layout.width)
        onLayout?.(event)
      }}
      className={cn(
        'w-full max-w-[480px] flex-row items-center gap-3 rounded-lg border border-border-default bg-surface-elevated p-4 shadow-sm',
        className,
      )}
      {...props}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pausar' : 'Reproduzir'}
        onPress={onPlayPause}
        className="size-11 shrink-0 items-center justify-center rounded-full bg-button-primary-bg active:bg-button-primary-bg-active"
      >
        {playing ? <PauseIcon color={iconColor} /> : <PlayIcon color={iconColor} />}
      </Pressable>
      <View
        className={cn(
          'min-w-0 flex-1',
          stacked ? 'flex-col items-stretch gap-1' : 'flex-row items-center gap-2',
        )}
      >
        <View
          {...seek.props}
          className={cn('h-[34px] min-w-0 justify-center', stacked ? 'w-full' : 'flex-1')}
        >
          {/* Filhos ignoram toques para que `locationX` seja sempre relativo à onda. */}
          <View pointerEvents="none" className="h-full flex-row items-center gap-0.5">
            {peaks.map((peak, i) => (
              <View
                // biome-ignore lint/suspicious/noArrayIndexKey: as barras são posicionais e fixas
                key={i}
                className={cn(
                  'min-w-0.5 flex-1 rounded-full',
                  i < played ? 'bg-button-primary-bg' : 'bg-media-wave-rest',
                )}
                style={{ height: BAR_MIN + peak * BAR_RANGE }}
              />
            ))}
          </View>
        </View>
        <Text
          accessible={false}
          className="shrink-0 text-xs font-medium leading-4 text-text-secondary"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Velocidade de reprodução: ${speed}x`}
        onPress={nextSpeed}
        className="h-8 w-16 shrink-0 items-center justify-center rounded-full border border-border-default bg-surface-elevated active:bg-bg-tertiary"
      >
        <Text className="text-sm font-medium leading-5 text-text-secondary">{speed}x</Text>
      </Pressable>
    </View>
  )
}
