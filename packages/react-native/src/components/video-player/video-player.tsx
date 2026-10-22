/// <reference types="uniwind/types" />

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Pressable, StyleSheet, Text, View, type ViewProps } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import { cn } from '../../utils/cn'
import { formatTime, useSeek } from '../_shared/media'
import {
  MaximizeIcon,
  MinimizeIcon,
  PauseIcon,
  PlayIcon,
  VolumeIcon,
  VolumeMutedIcon,
} from '../_shared/media-icons'
import { useToken } from '../_shared/use-token'

export type VideoPlayerProps = Omit<ViewProps, 'style'> & {
  className?: string
  /** A superfície de vídeo (ex.: o `VideoView` do `expo-video`), que preenche o player. */
  children: ReactNode
  /** Nome acessível do player. */
  label?: string
  /** Tocando agora: mostra o botão de pausar e esconde o play central. */
  playing?: boolean
  /** Posição atual, em segundos. */
  position?: number
  /** Duração total, em segundos. */
  duration?: number
  /** Sem som: mostra o ícone de volume cortado. */
  muted?: boolean
  /** Em tela cheia: mostra o ícone de sair. Só vale com `onToggleFullscreen`. */
  fullscreen?: boolean
  onPlayPause?: () => void
  /** Chamado com a posição (em segundos) tocada ou arrastada na barra. */
  onSeek?: (seconds: number) => void
  onToggleMute?: () => void
  /** Sem ele, o botão de tela cheia não aparece. */
  onToggleFullscreen?: () => void
  /** Tempo sem interação, em ms, até esconder os controles durante a reprodução. Padrão: 2500. */
  hideControlsAfter?: number
}

const button =
  'size-9 shrink-0 items-center justify-center rounded-full active:bg-media-on-surface/15'

/**
 * Casca de player de vídeo: play central, posição, tempo, mudo e tela cheia sobre o seu vídeo.
 * Não toca nada: quem usa guarda o estado (por exemplo com `expo-video`) e o passa por props,
 * ligando os `on…` ao player de verdade. Tocar no vídeo alterna play/pause e mostra os controles,
 * que somem depois de um tempo sem toques enquanto toca (com leitor de tela ligado, ficam).
 */
export function VideoPlayer({
  className,
  children,
  label = 'Vídeo',
  playing = false,
  position = 0,
  duration = 0,
  muted = false,
  fullscreen = false,
  onPlayPause,
  onSeek,
  onToggleMute,
  onToggleFullscreen,
  hideControlsAfter = 2500,
  ...props
}: VideoPlayerProps) {
  const [active, setActive] = useState(true)
  const [screenReader, setScreenReader] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const onSurface = useToken('--color-media-on-surface')
  const accent = useToken('--color-interactive-primary')
  const scrim = useToken('--color-media-surface') ?? '#000000'
  const seek = useSeek({ position, duration, label: 'Posição do vídeo', onSeek })
  const visible = active || !playing || screenReader
  const progress = duration ? Math.min(position / duration, 1) * 100 : 0

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader)
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setScreenReader)
    return () => subscription.remove()
  }, [])

  const show = useCallback(() => {
    setActive(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setActive(false), hideControlsAfter)
  }, [hideControlsAfter])

  useEffect(() => {
    if (playing) show()
    else setActive(true)
    return () => clearTimeout(timer.current)
  }, [playing, show])

  return (
    <View
      accessibilityLabel={label}
      className={cn(
        'aspect-video w-full overflow-hidden rounded-lg bg-media-surface shadow-lg',
        className,
      )}
      {...props}
    >
      <View pointerEvents="none" className="absolute inset-0">
        {children}
      </View>
      <Pressable
        accessible={false}
        onPress={() => {
          onPlayPause?.()
          show()
        }}
        className="absolute inset-0"
      >
        {!playing && <View pointerEvents="none" className="absolute inset-0 bg-media-surface/30" />}
      </Pressable>
      {!playing && (
        <View pointerEvents="box-none" className="absolute inset-0 items-center justify-center">
          <Pressable
            accessible={false}
            importantForAccessibility="no"
            onPress={onPlayPause}
            className="size-16 items-center justify-center rounded-full bg-media-on-surface shadow-lg"
          >
            <PlayIcon filled size={28} color={accent} />
          </Pressable>
        </View>
      )}
      <View
        pointerEvents={visible ? 'box-none' : 'none'}
        importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
        accessibilityElementsHidden={!visible}
        className={cn('absolute inset-x-0 bottom-0 px-4 pb-3 pt-[30px]', !visible && 'opacity-0')}
      >
        <Svg pointerEvents="none" style={StyleSheet.absoluteFill} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="scrim" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0" stopColor={scrim} stopOpacity={0.65} />
              <Stop offset="1" stopColor={scrim} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#scrim)" />
        </Svg>
        <View {...seek.props} className="mb-1 h-4 w-full justify-center">
          {/* Filhos ignoram toques para que `locationX` seja sempre relativo à barra. */}
          <View pointerEvents="none" className="h-1 w-full rounded-full bg-media-on-surface/30">
            <View
              className="h-full rounded-full bg-media-accent"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
        <View className="h-9 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={playing ? 'Pausar' : 'Reproduzir'}
              onPress={() => {
                onPlayPause?.()
                show()
              }}
              className={button}
            >
              {playing ? <PauseIcon color={onSurface} /> : <PlayIcon color={onSurface} />}
            </Pressable>
            <Text
              accessible={false}
              className="text-xs font-medium leading-4 text-media-on-surface"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatTime(position)} / {formatTime(duration)}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={muted ? 'Ativar o som' : 'Silenciar'}
              onPress={() => {
                onToggleMute?.()
                show()
              }}
              className={button}
            >
              {muted ? <VolumeMutedIcon color={onSurface} /> : <VolumeIcon color={onSurface} />}
            </Pressable>
            {onToggleFullscreen && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
                onPress={onToggleFullscreen}
                className={button}
              >
                {fullscreen ? (
                  <MinimizeIcon color={onSurface} />
                ) : (
                  <MaximizeIcon color={onSurface} />
                )}
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}
