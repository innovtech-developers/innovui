'use client'

import {
  type ComponentProps,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '../../utils/cn'
import { NextIcon, PreviousIcon } from '../_shared/media-icons'
import { IconButton } from '../icon-button'

export type CarouselProps = Omit<ComponentProps<'section'>, 'children'> & {
  /** Nome acessível do carrossel (ex.: "Modelos de mensagem"). */
  label: string
  /** Os itens: use `CarouselItem`. */
  children: ReactNode
  /** Mostra os pontos de posição. Padrão: `true`. */
  showDots?: boolean
  /** Mostra as setas anterior/próximo. Padrão: `true`. */
  showArrows?: boolean
  /** Chamado com o índice do item em destaque sempre que ele muda. */
  onIndexChange?: (index: number) => void
  previousLabel?: string
  nextLabel?: string
  /** Monta o nome acessível de cada ponto. Padrão: "Ir para o item N". */
  dotLabel?: (index: number) => string
}

const DRAG_THRESHOLD = 5

/**
 * Fileira de itens que desliza com arrasto, rolagem, teclado ou setas, e encaixa item a item.
 * O último item "chega ao fim" mesmo que não caiba alinhado à esquerda: o ponto e a seta refletem isso.
 */
export function Carousel({
  className,
  label,
  children,
  showDots = true,
  showArrows = true,
  onIndexChange,
  previousLabel = 'Item anterior',
  nextLabel = 'Próximo item',
  dotLabel = (index) => `Ir para o item ${index + 1}`,
  ...props
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [count, setCount] = useState(0)
  const drag = useRef({ id: -1, startX: 0, startScroll: 0, moved: false })
  const [dragging, setDragging] = useState(false)

  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCount(track.children.length)
    setActive(nearestIndex(track))
  }, [])

  // sem deps de propósito: os itens podem mudar a qualquer render e o setState de mesmo valor é barato
  useEffect(update)
  useEffect(() => {
    const track = trackRef.current
    if (!track || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(track)
    return () => observer.disconnect()
  }, [update])

  // o callback vai por ref: um `onIndexChange` inline (novo a cada render) não pode redisparar o aviso
  const onIndexChangeRef = useRef(onIndexChange)
  onIndexChangeRef.current = onIndexChange
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    onIndexChangeRef.current?.(active)
  }, [active])

  function goTo(index: number, behavior: ScrollBehavior = 'smooth') {
    const track = trackRef.current
    const item = track?.children[Math.min(Math.max(index, 0), count - 1)] as HTMLElement | undefined
    if (!track || !item) return
    track.scrollTo?.({ left: item.offsetLeft, behavior })
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return
    if (event.key === 'ArrowRight') goTo(active + 1)
    else if (event.key === 'ArrowLeft') goTo(active - 1)
    else if (event.key === 'Home') goTo(0)
    else if (event.key === 'End') goTo(count - 1)
    else return
    event.preventDefault()
  }

  // Arrastar com o mouse (toque e caneta já rolam sozinhos): move o scrollLeft e encaixa ao soltar.
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current
    if (event.pointerType !== 'mouse' || event.button !== 0 || !track) return
    drag.current = {
      id: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current
    const state = drag.current
    if (!track || state.id !== event.pointerId) return
    const delta = event.clientX - state.startX
    if (!state.moved && Math.abs(delta) < DRAG_THRESHOLD) return
    if (!state.moved) {
      state.moved = true
      setDragging(true)
      track.setPointerCapture?.(event.pointerId)
    }
    track.scrollLeft = state.startScroll - delta
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current
    const state = drag.current
    if (!track || state.id !== event.pointerId) return
    state.id = -1
    if (!state.moved) return
    setDragging(false)
    track.releasePointerCapture?.(event.pointerId)
    update()
    // o clique que vem logo depois do arrasto não deve acionar o conteúdo do item
    track.addEventListener('click', (e) => e.stopPropagation(), { capture: true, once: true })
    queueMicrotask(() => goTo(nearestIndex(track)))
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('iu:flex iu:flex-col iu:gap-6', className)}
      {...props}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: o arrasto com o mouse é um atalho; teclado, dots e setas fazem o mesmo */}
      <div
        ref={trackRef}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: região rolável precisa de foco para o teclado
        tabIndex={0}
        onScroll={update}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          'iu:relative iu:flex iu:gap-4 iu:overflow-x-auto iu:scroll-smooth iu:snap-x iu:snap-mandatory iu:rounded-lg iu:outline-none iu:[scrollbar-width:none] iu:[&::-webkit-scrollbar]:hidden iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)] iu:motion-reduce:scroll-auto',
          dragging && 'iu:cursor-grabbing iu:snap-none iu:scroll-auto iu:select-none',
        )}
      >
        {children}
      </div>
      {(showDots || showArrows) && count > 0 && (
        <div className="iu:flex iu:items-center iu:justify-between">
          {showDots ? (
            <div className="iu:flex iu:items-center iu:gap-2">
              {Array.from({ length: count }, (_, i) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: os pontos são posicionais
                  key={i}
                  type="button"
                  aria-label={dotLabel(i)}
                  aria-current={i === active || undefined}
                  onClick={() => goTo(i)}
                  className="iu:group iu:flex iu:h-11 iu:items-center iu:justify-center iu:rounded-md iu:outline-none iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)]"
                >
                  <span
                    className={cn(
                      'iu:h-2 iu:rounded-full iu:transition-[width,background-color] iu:motion-reduce:transition-none',
                      i === active
                        ? 'iu:w-6 iu:bg-[var(--color-interactive-primary)]'
                        : 'iu:w-2 iu:bg-[var(--color-border-strong)] iu:group-hover:bg-[var(--color-interactive-primary-hover)]',
                    )}
                  />
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          {showArrows && (
            <div className="iu:flex iu:gap-2">
              <IconButton
                aria-label={previousLabel}
                variant="tertiary"
                disabled={active <= 0}
                onClick={() => goTo(active - 1)}
              >
                <PreviousIcon />
              </IconButton>
              <IconButton
                aria-label={nextLabel}
                variant="tertiary"
                disabled={active >= count - 1}
                onClick={() => goTo(active + 1)}
              >
                <NextIcon />
              </IconButton>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

/** Um item do `Carousel`. Largura padrão: ~78% no celular e ~52% a partir do tablet (mostra um pedaço do próximo). */
export function CarouselItem({ className, ...props }: ComponentProps<'div'>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: o padrão de carrossel da WAI-ARIA pede role="group" + roledescription "slide"
    <div
      role="group"
      aria-roledescription="slide"
      className={cn(
        'iu:min-w-0 iu:shrink-0 iu:basis-[78%] iu:snap-start iu:tablet:basis-[52%]',
        className,
      )}
      {...props}
    />
  )
}

/** Índice do item mais perto do início da área visível; o último vale quando a rolagem chegou ao fim. */
function nearestIndex(track: HTMLElement) {
  const items = [...track.children] as HTMLElement[]
  const max = track.scrollWidth - track.clientWidth
  if (items.length && max > 0 && track.scrollLeft >= max - 1) return items.length - 1
  let best = 0
  let distance = Infinity
  items.forEach((item, i) => {
    const d = Math.abs(item.offsetLeft - track.scrollLeft)
    if (d < distance) {
      distance = d
      best = i
    }
  })
  return best
}
