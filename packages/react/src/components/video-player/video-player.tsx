'use client'

import * as RadixSlider from '@radix-ui/react-slider'
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '../../utils/cn'
import { formatTime, togglePlayback, useMediaPlayback, useSeek } from '../_shared/media'
import {
  MaximizeIcon,
  MinimizeIcon,
  PauseIcon,
  PlayIcon,
  VolumeIcon,
  VolumeMutedIcon,
} from '../_shared/media-icons'

type WebkitVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void }

export type VideoPlayerProps = Omit<
  ComponentProps<'div'>,
  'children' | 'onPlay' | 'onPause' | 'onEnded' | 'onTimeUpdate'
> & {
  src: string
  /** Imagem mostrada antes de começar. */
  poster?: string
  /** Nome acessível do player. */
  label?: string
  /** `<track>` de legendas ou `<source>` alternativos, repassados ao `<video>`. */
  children?: ReactNode
  autoPlay?: boolean
  loop?: boolean
  /** Começa sem som (necessário para `autoPlay` na maioria dos navegadores). */
  muted?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  /** Tempo sem interação, em ms, até esconder os controles durante a reprodução. Padrão: 2500. */
  hideControlsAfter?: number
  onPlay?: ComponentProps<'video'>['onPlay']
  onPause?: ComponentProps<'video'>['onPause']
  onEnded?: ComponentProps<'video'>['onEnded']
  onTimeUpdate?: ComponentProps<'video'>['onTimeUpdate']
}

function hasKeyboardFocus(element: HTMLElement | null) {
  if (!element) return false
  try {
    return element.matches(':has(:focus-visible)')
  } catch {
    return element.matches(':focus-within')
  }
}

const control =
  'iu:flex iu:size-9 iu:shrink-0 iu:items-center iu:justify-center iu:rounded-full iu:text-[var(--color-media-on-surface)] iu:transition-colors iu:outline-none iu:hover:bg-[color-mix(in_srgb,var(--color-media-on-surface)_15%,transparent)] iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)] iu:motion-reduce:transition-none'

/**
 * Player de vídeo com controles próprios: play central, posição, tempo, volume e tela cheia.
 * Os controles somem depois de {@link VideoPlayerProps.hideControlsAfter} sem interação enquanto
 * toca, e voltam ao mexer o mouse, tocar na tela ou usar o teclado. Abaixo de 560px de largura o
 * slider de volume some (o botão de mudo fica) e a barra de posição desce para a borda de baixo,
 * abaixo dos botões. No iPhone, a tela cheia abre o player do iOS.
 */
export function VideoPlayer({
  className,
  src,
  poster,
  label = 'Vídeo',
  children,
  autoPlay,
  loop,
  muted,
  preload = 'metadata',
  hideControlsAfter = 2500,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  ...props
}: VideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const { playing, currentTime, duration, volume, muted: isMuted } = useMediaPlayback(videoRef)
  const [active, setActive] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [canFullscreen, setCanFullscreen] = useState(true)
  const [canSetVolume, setCanSetVolume] = useState(true)

  const showControls = useCallback(() => {
    setActive(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      // com o foco do teclado nos controles, eles ficam; o foco de um clique de mouse não conta
      if (videoRef.current?.paused || hasKeyboardFocus(controlsRef.current)) return
      setActive(false)
    }, hideControlsAfter)
  }, [hideControlsAfter])

  useEffect(() => {
    if (playing) showControls()
    else setActive(true)
    return () => window.clearTimeout(timer.current)
  }, [playing, showControls])

  useEffect(() => {
    const video = videoRef.current as WebkitVideo | null
    setCanFullscreen(
      Boolean(document.fullscreenEnabled) || typeof video?.webkitEnterFullscreen === 'function',
    )
    // no iOS o volume só se ajusta nos botões do aparelho: `volume` ignora a atribuição
    if (video) {
      const previous = video.volume
      video.volume = 0.5
      setCanSetVolume(video.volume === 0.5)
      video.volume = previous
    }
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  function toggleFullscreen() {
    const root = rootRef.current
    if (document.fullscreenElement) document.exitFullscreen()
    else if (root?.requestFullscreen) root.requestFullscreen()
    else (videoRef.current as WebkitVideo | null)?.webkitEnterFullscreen?.()
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    if (video.muted || video.volume === 0) {
      video.muted = false
      if (video.volume === 0) video.volume = 1
    } else video.muted = true
  }

  function changeVolume([value]: number[]) {
    const video = videoRef.current
    if (!video || value === undefined) return
    video.volume = value / 100
    video.muted = value === 0
  }

  const seekProps = useSeek({
    currentTime,
    duration,
    onSeek(time) {
      if (videoRef.current) videoRef.current.currentTime = time
    },
  })
  const progress = duration ? (currentTime / duration) * 100 : 0
  const silent = isMuted || volume === 0
  const visible = active || !playing

  return (
    // biome-ignore lint/a11y/useSemanticElements: <fieldset> traz borda e margens próprias de formulário
    <div
      ref={rootRef}
      role="group"
      aria-label={label}
      onPointerMove={showControls}
      onPointerDown={showControls}
      onKeyDown={showControls}
      onFocus={showControls}
      className={cn(
        'iu:@container iu:relative iu:aspect-video iu:w-full iu:overflow-hidden iu:rounded-lg iu:bg-[var(--color-media-surface)] iu:shadow-lg iu:[&:fullscreen]:aspect-auto iu:[&:fullscreen]:rounded-none',
        playing && !visible && 'iu:cursor-none',
        className,
      )}
      {...props}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload={preload}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        onClick={() => togglePlayback(videoRef.current)}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        className="iu:size-full iu:object-contain"
      >
        {children}
      </video>
      {!playing && (
        <>
          <div
            aria-hidden="true"
            className="iu:pointer-events-none iu:absolute iu:inset-0 iu:bg-[color-mix(in_srgb,var(--color-media-surface)_30%,transparent)]"
          />
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => togglePlayback(videoRef.current)}
            className="iu:absolute iu:top-1/2 iu:left-1/2 iu:flex iu:size-12 iu:@[560px]:size-16 iu:-translate-x-1/2 iu:-translate-y-1/2 iu:items-center iu:justify-center iu:rounded-full iu:bg-[var(--color-media-on-surface)] iu:text-[var(--color-interactive-primary)] iu:shadow-lg iu:outline-none iu:transition-transform iu:hover:scale-105 iu:motion-reduce:transition-none"
          >
            <PlayIcon filled className="iu:size-6 iu:@[560px]:size-7" />
          </button>
        </>
      )}
      <div
        ref={controlsRef}
        inert={!visible}
        className={cn(
          'iu:absolute iu:inset-x-0 iu:bottom-0 iu:flex iu:flex-col iu:bg-linear-to-t iu:from-[color-mix(in_srgb,var(--color-media-surface)_65%,transparent)] iu:to-transparent iu:pointer-events-none iu:pt-6 iu:@[560px]:pb-2 iu:transition-opacity iu:duration-200 iu:motion-reduce:transition-none',
          !visible && 'iu:opacity-0',
        )}
      >
        <div className="iu:pointer-events-auto iu:flex iu:h-9 iu:items-center iu:justify-between iu:px-2">
          <div className="iu:flex iu:items-center iu:gap-2">
            <button
              type="button"
              aria-label={playing ? 'Pausar' : 'Reproduzir'}
              onClick={() => togglePlayback(videoRef.current)}
              className={control}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <span
              aria-hidden="true"
              className="iu:text-xs iu:leading-4 iu:font-medium iu:text-[var(--color-media-on-surface)] iu:tabular-nums"
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="iu:flex iu:items-center iu:gap-2">
            <button
              type="button"
              aria-label={silent ? 'Ativar o som' : 'Silenciar'}
              onClick={toggleMute}
              className={control}
            >
              {silent ? <VolumeMutedIcon /> : <VolumeIcon />}
            </button>
            {canSetVolume && (
              <RadixSlider.Root
                aria-label="Volume"
                min={0}
                max={100}
                step={1}
                value={[silent ? 0 : Math.round(volume * 100)]}
                onValueChange={changeVolume}
                className="iu:relative iu:hidden iu:h-9 iu:w-20 iu:touch-none iu:items-center iu:select-none iu:@[560px]:flex"
              >
                <RadixSlider.Track className="iu:relative iu:h-1 iu:grow iu:rounded-full iu:bg-[color-mix(in_srgb,var(--color-media-on-surface)_30%,transparent)]">
                  <RadixSlider.Range className="iu:absolute iu:h-full iu:rounded-full iu:bg-[var(--color-media-accent)]" />
                </RadixSlider.Track>
                <RadixSlider.Thumb
                  aria-label="Volume"
                  className="iu:block iu:size-4 iu:cursor-pointer iu:rounded-full iu:bg-[var(--color-media-accent)] iu:outline-none iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-media-on-surface)]"
                />
              </RadixSlider.Root>
            )}
            {canFullscreen && (
              <button
                type="button"
                aria-label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
                onClick={toggleFullscreen}
                className={control}
              >
                {fullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
              </button>
            )}
          </div>
        </div>
        {/* Estreito: barra rente à borda de baixo (YouTube mobile), com margem para o canto arredondado não cortá-la. Largo: acima dos botões (YouTube desktop, Netflix). */}
        {/* biome-ignore lint/a11y/useFocusableInteractive: tabIndex e aria-value* vêm do useSeek */}
        <div
          {...seekProps}
          // biome-ignore lint/a11y/useAriaPropsForRole: aria-value* vêm do useSeek
          role="slider"
          aria-label="Posição do vídeo"
          className="iu:group/seek iu:pointer-events-auto iu:order-last iu:mx-4 iu:mb-1 iu:flex iu:@[560px]:order-first iu:@[560px]:mb-0 iu:h-4 iu:cursor-pointer iu:touch-none iu:items-center iu:outline-none"
        >
          <div className="iu:h-1 iu:w-full iu:rounded-full iu:bg-[color-mix(in_srgb,var(--color-media-on-surface)_30%,transparent)] iu:group-focus-visible/seek:ring-2 iu:group-focus-visible/seek:ring-[var(--color-border-focus)]">
            <div
              style={{ width: `${progress}%` }}
              className="iu:h-full iu:rounded-full iu:bg-[var(--color-media-accent)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
