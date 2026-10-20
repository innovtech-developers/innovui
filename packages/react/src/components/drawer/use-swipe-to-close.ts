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
 * inteiro sem roubar a rolagem do corpo. Se o gesto começa rolando o conteúdo e este chega ao
 * começo, o resto do gesto passa a arrastar o painel (o navegador já assumiu a rolagem, então aí
 * não há `preventDefault`, só o `translate`). Devolve os refs do painel e do backdrop (que clareia
 * junto); `closeRef` é o botão de fechar, clicado ao soltar, para o Radix fechar (controlado ou
 * não) e rodar a animação de saída a partir de onde o painel foi solto.
 */
export function useSwipeToClose(
  side: Side,
  enabled: boolean,
  closeRef: RefObject<HTMLButtonElement | null>,
) {
  const [panel, setPanel] = useState<HTMLElement | null>(null)
  const [overlay, setOverlay] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!panel || !enabled) return
    const { axis, sign } = closing[side]
    const along = (t: Touch) => (axis === 'x' ? t.clientX : t.clientY)
    const across = (t: Touch) => (axis === 'x' ? t.clientY : t.clientX)

    // `scroll`: o conteúdo ainda rola no sentido de fechar; vigiamos para o caso de ele acabar.
    let mode: 'pending' | 'scroll' | 'drag' | 'ignore' = 'ignore'
    let startAlong = 0
    let startAcross = 0
    let origin = 0 // posição do dedo em que o painel estava em 0
    let handedOff = false // o arraste veio da rolagem, e volta a ela se o dedo recuar até a origem
    let prev = 0
    let size = 1
    let offset = 0
    let velocity = 0
    let last = { offset: 0, time: 0 }

    const apply = (value: number) => {
      offset = value
      panel.style.translate = axis === 'x' ? `${value * sign}px 0` : `0 ${value * sign}px`
      // o backdrop clareia à medida que o painel sai
      if (overlay) overlay.style.opacity = String(1 - Math.min(1, value / size))
    }

    const reset = () => {
      const animated = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      if (animated) {
        panel.style.transition = 'translate 200ms ease-out'
        if (overlay) overlay.style.transition = 'opacity 200ms ease-out'
        setTimeout(() => {
          panel.style.transition = ''
          if (overlay) overlay.style.transition = ''
        }, 200)
      }
      panel.style.translate = ''
      if (overlay) overlay.style.opacity = ''
    }

    const startDrag = (at: number, fromScroll: boolean) => {
      // entrada ainda rodando (ou volta de um gesto anterior): termina, senão venceria o inline.
      // Não se mexe em `animation` inline: apagá-la depois reiniciaria a animação de entrada.
      for (const el of [panel, overlay]) for (const a of el?.getAnimations?.() ?? []) a.finish()
      mode = 'drag'
      handedOff = fromScroll
      origin = at
      size = (axis === 'x' ? panel.offsetWidth : panel.offsetHeight) || 1
      velocity = 0
      // vindo da rolagem a velocidade conta daqui; senão, do toque inicial (ver `onStart`)
      if (fromScroll) last = { offset: 0, time: performance.now() }
    }

    const onStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      const interactive = e.target instanceof Element && e.target.closest(INTERACTIVE)
      if (!touch || e.touches.length > 1 || interactive) {
        mode = 'ignore'
        return
      }
      startAlong = prev = origin = along(touch)
      startAcross = across(touch)
      mode = 'pending'
      offset = 0
      last = { offset: 0, time: performance.now() }
    }

    const onMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch || mode === 'ignore') return
      const pos = along(touch)

      if (mode === 'pending') {
        const main = pos - startAlong
        const cross = across(touch) - startAcross
        if (Math.max(Math.abs(main), Math.abs(cross)) < SLOP) return
        if (Math.abs(main) <= Math.abs(cross) || main * sign <= 0) mode = 'ignore'
        else if (scrollsInstead(e.target, panel, axis, sign)) mode = 'scroll'
        else startDrag(startAlong, false)
      }

      if (mode === 'scroll') {
        // o conteúdo chegou ao começo e o dedo segue no sentido de fechar: o painel assume
        const towardClose = (pos - prev) * sign > 0
        prev = pos
        if (towardClose && !scrollsInstead(e.target, panel, axis, sign)) startDrag(pos, true)
        else return
      }

      if (mode !== 'drag') return
      const raw = (pos - origin) * sign
      if (handedOff && raw < 0) {
        // o dedo recuou além da origem: devolve ao conteúdo, que rola no sentido contrário
        panel.style.translate = ''
        if (overlay) overlay.style.opacity = ''
        offset = 0
        mode = 'scroll'
        prev = pos
        return
      }
      if (e.cancelable) e.preventDefault()
      apply(Math.max(0, raw))
      const now = performance.now()
      // eventos colados dão velocidade espúria: só amostra com ao menos 4ms de intervalo
      if (now - last.time >= 4) {
        velocity = (offset - last.offset) / (now - last.time)
        last = { offset, time: now }
      }
    }

    const onEnd = () => {
      if (mode !== 'drag') {
        mode = 'ignore'
        return
      }
      mode = 'ignore'
      if (offset > size * CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) {
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
  }, [panel, overlay, enabled, side, closeRef])

  return { panelRef: setPanel, overlayRef: setOverlay }
}
