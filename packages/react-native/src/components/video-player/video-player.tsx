/// <reference types="uniwind/types" />

import {
  cloneElement,
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AccessibilityInfo, Pressable, Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'
import { formatTime, useSeek } from '../_shared/media'
import { MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon } from '../_shared/media-icons'
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
  /**
   * Em tela cheia: mostra o ícone de sair. Só vale com `onToggleFullscreen`. Ligue ao estado do
   * vídeo (`onFullscreenEnter`/`onFullscreenExit` do `VideoView`): no iOS, é com ele que o
   * `VideoPlayer` liga os controles do sistema na tela cheia.
   */
  fullscreen?: boolean
  onPlayPause?: () => void
  /** Chamado com a posição (em segundos) tocada ou arrastada na barra. */
  onSeek?: (seconds: number) => void
  /** Sem ele, o botão de tela cheia não aparece. */
  onToggleFullscreen?: () => void
  /** Tempo sem interação, em ms, até esconder os controles durante a reprodução. Padrão: 2500. */
  hideControlsAfter?: number
}

// 44px: o mínimo de área de toque recomendado no iOS (Apple HIG) e perto dos 48dp do Android.
const button =
  'size-11 shrink-0 items-center justify-center rounded-full active:bg-media-on-surface/15'

/**
 * Casca de player de vídeo: play/pause central, posição, tempo e tela cheia sobre o seu vídeo.
 * Não toca nada: quem usa guarda o estado (por exemplo com `expo-video`) e o passa por props,
 * ligando os `on…` ao player de verdade. Tocar no vídeo mostra ou esconde os controles, que também
 * somem sozinhos depois de um tempo sem toques enquanto toca (com leitor de tela ligado, ficam).
 */
export function VideoPlayer({
  className,
  children,
  label = 'Vídeo',
  playing = false,
  position = 0,
  duration = 0,
  fullscreen = false,
  onPlayPause,
  onSeek,
  onToggleFullscreen,
  hideControlsAfter = 2500,
  ...props
}: VideoPlayerProps) {
  const [active, setActive] = useState(true)
  const [screenReader, setScreenReader] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const onSurface = useToken('--color-media-on-surface')
  const accent = useToken('--color-interactive-primary')
  const seek = useSeek({ position, duration, label: 'Posição do vídeo', onSeek })
  const visible = active || !playing || screenReader
  const progress = duration ? Math.min(position / duration, 1) * 100 : 0
  const ended = !playing && duration > 0 && position >= duration - 0.1
  // Em tela cheia o vídeo sai do player e os nossos controles não vão junto: ligamos os do sistema.
  // No iOS eles precisam estar ligados antes de abrir, então `entering` vem antes do `onToggleFullscreen`.
  const [entering, setEntering] = useState(false)
  const toggleFullscreen = useRef(onToggleFullscreen)
  toggleFullscreen.current = onToggleFullscreen
  const nativeControls = entering || fullscreen

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader)
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setScreenReader)
    return () => subscription.remove()
  }, [])

  const hide = () => {
    clearTimeout(timer.current)
    setActive(false)
  }

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

  useEffect(() => {
    if (!entering) return
    toggleFullscreen.current?.()
    // ponytail: se `fullscreen` nunca for ligado ao estado, os controles do sistema voltam a sumir após 2s
    const done = setTimeout(() => setEntering(false), 2000)
    return () => clearTimeout(done)
  }, [entering])

  // No expo-video, `play()` no fim do vídeo não faz nada: volta ao começo antes.
  const playPause = () => {
    if (ended) onSeek?.(0)
    onPlayPause?.()
  }

  return (
    <View
      accessibilityLabel={label}
      className={cn(
        'aspect-video w-full overflow-hidden rounded-[12px] bg-media-surface shadow-lg',
        className,
      )}
      {...props}
    >
      <View pointerEvents="none" className="absolute inset-0">
        {isValidElement<{ nativeControls?: boolean }>(children) &&
        children.props.nativeControls !== undefined
          ? cloneElement(children, {
              nativeControls: nativeControls || children.props.nativeControls,
            })
          : children}
      </View>
      {/* Tocar no vídeo só mostra/esconde os controles: pausar sem querer é o erro mais comum no celular. */}
      <Pressable
        accessible={false}
        onPress={() => {
          if (!playing) return
          if (visible) hide()
          else show()
        }}
        className="absolute inset-0"
      >
        {visible && <View pointerEvents="none" className="absolute inset-0 bg-media-surface/40" />}
      </Pressable>
      <View
        pointerEvents={visible ? 'box-none' : 'none'}
        importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
        accessibilityElementsHidden={!visible}
        className={cn('absolute inset-0', !visible && 'opacity-0')}
      >
        <View pointerEvents="box-none" className="absolute inset-0 items-center justify-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={playing ? 'Pausar' : 'Reproduzir'}
            onPress={() => {
              playPause()
              show()
            }}
            className="size-14 items-center justify-center rounded-full bg-media-on-surface shadow-lg active:opacity-80"
          >
            {playing ? (
              <PauseIcon filled size={24} color={accent} />
            ) : (
              <PlayIcon filled size={24} color={accent} />
            )}
          </Pressable>
        </View>
        <View pointerEvents="box-none" className="absolute inset-x-0 bottom-0">
          <View
            pointerEvents="box-none"
            className="h-11 flex-row items-center justify-between pl-4 pr-1"
          >
            <Text
              accessible={false}
              className="text-xs font-medium leading-4 text-media-on-surface"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatTime(position)} / {formatTime(duration)}
            </Text>
            {onToggleFullscreen && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
                onPress={() => (fullscreen ? onToggleFullscreen() : setEntering(true))}
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
          {/* 32px de altura para o dedo acertar a barra de 4px; sobe 8px sobre a folga do botão acima. */}
          <View {...seek.props} className="-mt-2 mx-4 h-8 justify-center">
            {/* Filhos ignoram toques para que `locationX` seja sempre relativo à barra. */}
            <View pointerEvents="none" className="h-1 w-full rounded-full bg-media-on-surface/30">
              <View
                className="h-full rounded-full bg-media-accent"
                style={{ width: `${progress}%` }}
              />
              <View
                className="absolute -top-1 size-3 rounded-full bg-media-accent"
                style={{ left: `${progress}%`, marginLeft: -6 }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
