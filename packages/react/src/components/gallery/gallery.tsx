'use client'

import { type ComponentProps, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { ExpandIcon } from '../_shared/media-icons'
import { Lightbox, type LightboxItem } from '../lightbox'

export type GalleryItem = LightboxItem & {
  /** Imagem menor para a grade; sem ela, a grade usa `src`. */
  thumbSrc?: string
}

export type GalleryProps = Omit<ComponentProps<'ul'>, 'children'> & {
  items: GalleryItem[]
  /** Nome acessível do botão de cada miniatura. Padrão: "Ampliar foto N: descrição". */
  openLabel?: (item: GalleryItem, index: number) => string
  /** Nome acessível do visualizador ampliado. */
  lightboxLabel?: string
}

/**
 * Grade de miniaturas (2 colunas no celular, 3 a partir do tablet) que abre a foto ampliada no
 * `Lightbox`. Ao fechar, o foco volta para a miniatura que abriu.
 */
export function Gallery({
  className,
  items,
  openLabel = (item, i) => `Ampliar foto ${i + 1}: ${item.alt}`,
  lightboxLabel,
  ...props
}: GalleryProps) {
  const [opened, setOpened] = useState<number | null>(null)
  const thumbs = useRef<(HTMLButtonElement | null)[]>([])
  const last = useRef(0)

  function show(index: number | null) {
    if (index !== null) last.current = index
    setOpened(index)
  }

  return (
    <>
      <ul
        className={cn(
          'iu:m-0 iu:grid iu:list-none iu:grid-cols-2 iu:gap-2 iu:p-0 iu:tablet:grid-cols-3',
          className,
        )}
        {...props}
      >
        {items.map((item, i) => (
          <li key={item.src}>
            <button
              ref={(el) => {
                thumbs.current[i] = el
              }}
              type="button"
              aria-label={openLabel(item, i)}
              onClick={() => show(i)}
              className="iu:group iu:relative iu:block iu:aspect-[4/3] iu:w-full iu:cursor-zoom-in iu:overflow-hidden iu:rounded-md iu:bg-[var(--color-bg-skeleton)] iu:outline-none"
            >
              <img
                src={item.thumbSrc ?? item.src}
                alt=""
                loading="lazy"
                className="iu:size-full iu:object-cover"
              />
              <span
                aria-hidden="true"
                className="iu:absolute iu:inset-0 iu:flex iu:items-center iu:justify-center iu:rounded-md iu:bg-[color-mix(in_srgb,var(--color-media-surface)_50%,transparent)] iu:text-[var(--color-media-on-surface)] iu:opacity-0 iu:ring-[var(--color-border-focus)] iu:ring-inset iu:transition-opacity iu:group-hover:opacity-100 iu:group-focus-visible:opacity-100 iu:group-focus-visible:ring-2 iu:motion-reduce:transition-none"
              >
                <ExpandIcon />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        items={items}
        label={lightboxLabel}
        open={opened !== null}
        onOpenChange={(open) => !open && show(null)}
        index={opened ?? 0}
        onIndexChange={show}
        // sem trigger o Radix não devolve o foco: vai para a miniatura da foto em que o usuário parou
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          thumbs.current[last.current]?.focus()
        }}
      />
    </>
  )
}
