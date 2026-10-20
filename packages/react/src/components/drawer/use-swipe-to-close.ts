'use client'

import { type RefObject, useEffect, useState } from 'react'

type Side = 'top' | 'right' | 'bottom' | 'left'

/** `x` ou `y` do eixo do arraste, e o sinal do movimento do dedo que fecha (para a borda do `side`). */
const closing = {
  right: { axis: 'x', sign: 1 },
  left: { axis: 'x', sign: -1 },
  bottom: { axis: 'y', sign: 1 },
  top: { axis: 'y', sign: -1 },
} as const

/** Quanto do painel precisa sair, ou a velocidade (px/ms) do gesto, para soltar e fechar. */
const CLOSE_DISTANCE = 0.4
const CLOSE_VELOCITY = 0.5
/** Movimento mínimo (px) antes de decidir se o gesto é um arraste. */
const SLOP = 6

const INTERACTIVE = 'input, textarea, select, [contenteditable], [role=slider], [data-no-drag]'

/** Algum ancestral do toque ainda rola no sentido do gesto? Então é a rolagem dele, não o arraste. */
function scrollsInstead(
  target: EventTarget | null,
  panel: HTMLElement,
  axis: 'x' | 'y',
  sign: number,
) {
  for (let node = target; node instanceof HTMLElement; node = node.parentElement) {
    const x = axis === 'x'
    const pos = x ? node.scrollLeft : node.scrollTop
    const size = x ? node.scrollWidth : node.scrollHeight
    const client = x ? node.clientWidth : node.clientHeight
    const overflow = getComputedStyle(node)[x ? 'overflowX' : 'overflowY']
    if (/auto|scroll/.test(overflow) && size > client + 1) {
      // dedo no sentido de fechar (sign > 0) leva o conteúdo para o início; o contrário, para o fim
      if (sign > 0 ? pos > 0 : pos + client < size - 1) return true
    }
    if (node === panel) break
  }
  return false
}

/**
 * Fecha o painel arrastando-o para a borda de onde ele veio (toque; o mouse tem `Esc` e o ×).
 *
 * Eventos de toque nativos, e não pointer events: só dá para segurar a rolagem do navegador
 * (`preventDefault`) num `touchmove` não passivo, e é isso que deixa o arraste valer no painel
 * inteiro sem roubar a rolagem do corpo. Devolve o ref do painel; `closeRef` é o botão de fechar,
 * clicado ao soltar, para o Radix fechar (controlado ou não) e rodar a animação de saída.
 */
export function useSwipeToClose(
  side: Side,
  enabled: boolean,
  closeRef: RefObject<HTMLButtonElement | null>,
) {
  const [panel, setPanel] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!panel || !enabled) return
    const { axis, sign } = closing[side]
    let start: { x: number; y: number } | null = null
    let mode: 'pending' | 'drag' | 'ignore' = 'pending'
    let offset = 0
    let velocity = 0
    let last = { offset: 0, time: 0 }

    const reset = () => {
      const animated = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      panel.style.animation = ''
      if (animated) {
        panel.style.transition = 'translate 200ms ease-out'
        setTimeout(() => {
          panel.style.transition = ''
        }, 200)
      }
      panel.style.translate = ''
    }

    const onStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      const interactive = e.target instanceof Element && e.target.closest(INTERACTIVE)
      if (!touch || e.touches.length > 1 || interactive) {
        mode = 'ignore'
        return
      }
      start = { x: touch.clientX, y: touch.clientY }
      mode = 'pending'
      offset = 0
      velocity = 0
      last = { offset: 0, time: performance.now() }
    }

    const onMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!start || !touch || mode === 'ignore') return
      const dx = touch.clientX - start.x
      const dy = touch.clientY - start.y
      const main = axis === 'x' ? dx : dy
      const cross = axis === 'x' ? dy : dx
      if (mode === 'pending') {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < SLOP) return
        const drags =
          Math.abs(main) > Math.abs(cross) &&
          main * sign > 0 &&
          !scrollsInstead(e.target, panel, axis, sign)
        mode = drags ? 'drag' : 'ignore'
        // a animação de entrada, se ainda rodando, venceria o `translate` inline
        if (drags) panel.style.animation = 'none'
      }
      if (mode !== 'drag') return
      if (e.cancelable) e.preventDefault()
      offset = Math.max(0, main * sign)
      panel.style.translate = axis === 'x' ? `${offset * sign}px 0` : `0 ${offset * sign}px`
      const now = performance.now()
      // eventos colados dão velocidade espúria: só amostra com ao menos 4ms de intervalo
      if (now - last.time >= 4) {
        velocity = (offset - last.offset) / (now - last.time)
        last = { offset, time: now }
      }
    }

    const onEnd = () => {
      if (mode !== 'drag') return
      mode = 'ignore'
      const size = axis === 'x' ? panel.offsetWidth : panel.offsetHeight
      if (offset > size * CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) {
        // sem `animation: none`, a saída do Radix parte de onde o painel foi solto
        panel.style.animation = ''
        closeRef.current?.click()
        // controlado e ainda aberto (onOpenChange ignorou): volta ao lugar em vez de ficar torto
        requestAnimationFrame(() => panel.dataset.state === 'open' && reset())
      } else reset()
    }

    panel.addEventListener('touchstart', onStart, { passive: true })
    panel.addEventListener('touchmove', onMove, { passive: false })
    panel.addEventListener('touchend', onEnd)
    panel.addEventListener('touchcancel', onEnd)
    return () => {
      panel.removeEventListener('touchstart', onStart)
      panel.removeEventListener('touchmove', onMove)
      panel.removeEventListener('touchend', onEnd)
      panel.removeEventListener('touchcancel', onEnd)
    }
  }, [panel, enabled, side, closeRef])

  return setPanel
}
