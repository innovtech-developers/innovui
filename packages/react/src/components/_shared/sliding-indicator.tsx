'use client'

import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Indicador único que desliza até o item ativo (sublinhado das Tabs, pill do SegmentedControl).
 *
 * O indicador precisa ser filho direto do contêiner `position: relative`; o item ativo é achado por
 * `activeSelector`. Antes da primeira medição (SSR/hidratação) cada item ainda se desenha sozinho:
 * `measured` vira `data-slide` no contêiner, que apaga esse desenho e deixa só o indicador.
 * A transição só liga depois do primeiro quadro, para não deslizar do canto ao montar.
 */
export function useSlidingIndicator(activeSelector: string) {
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const [measured, setMeasured] = useState(false)

  useLayoutEffect(() => {
    const indicator = indicatorRef.current
    const container = indicator?.parentElement
    if (!indicator || !container) return

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    function update() {
      const active = container?.querySelector<HTMLElement>(activeSelector)
      if (!indicator || !container) return
      if (!active) {
        indicator.style.opacity = '0'
        return
      }
      indicator.style.opacity = ''
      indicator.style.translate = `${active.offsetLeft}px ${active.offsetTop}px`
      indicator.style.width = `${active.offsetWidth}px`
      indicator.style.height = `${active.offsetHeight}px`
      // tamanhos mudam sem o contêiner mudar (fonte carregando, rótulo novo): observa cada item
      resizeObserver?.observe(container)
      for (const item of container.children) if (item !== indicator) resizeObserver?.observe(item)
    }

    update()
    setMeasured(true)
    const frame = requestAnimationFrame(() => {
      indicator.dataset.ready = ''
    })
    const mutationObserver = new MutationObserver(update)
    mutationObserver.observe(container, {
      attributes: true,
      attributeFilter: ['data-state'],
      childList: true,
      subtree: true,
    })
    return () => {
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      mutationObserver.disconnect()
    }
  }, [activeSelector])

  return { indicatorRef, measured }
}
