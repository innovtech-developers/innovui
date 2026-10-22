'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { type CSSProperties, type KeyboardEvent, useState } from 'react'
import { cn } from '../../utils/cn'
import { NextIcon, PreviousIcon } from '../_shared/media-icons'
import { fadeStyles } from '../_shared/motion'
import { overlayStyles } from '../_shared/overlay'
import { CloseIcon } from '../_shared/status'
import { IconButton } from '../icon-button'

export type LightboxItem = {
  /** Endereço da imagem ampliada. */
  src: string
  /** Descrição da imagem para leitores de tela. */
  alt: string
}

export type LightboxProps = {
  items: LightboxItem[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Índice da imagem exibida (modo controlado). */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Nome acessível do diálogo. */
  label?: string
  closeLabel?: string
  previousLabel?: string
  nextLabel?: string
  /**
   * Chamado quando o foco volta ao fechar. Sem `Dialog.Trigger`, o Radix não devolve o foco sozinho:
   * chame `event.preventDefault()` e foque você mesmo o elemento que abriu (o `Gallery` faz isso).
   */
  onCloseAutoFocus?: (event: Event) => void
  className?: string
}

const roundButton =
  'iu:bg-[var(--color-surface-elevated)] iu:border-[var(--color-border-default)] iu:text-[var(--color-text-primary)] iu:hover:bg-[var(--color-bg-secondary)] iu:rounded-full'

/**
 * Imagem ampliada sobre um fundo escurecido, com setas, contador (`1 / 6`) e `Esc` para fechar.
 * As setas dão a volta (da última vai para a primeira). Use com `Gallery` ou com qualquer miniatura.
 */
export function Lightbox({
  items,
  open,
  defaultOpen,
  onOpenChange,
  index,
  defaultIndex = 0,
  onIndexChange,
  label = 'Visualizador de imagens',
  closeLabel = 'Fechar',
  previousLabel = 'Foto anterior',
  nextLabel = 'Próxima foto',
  onCloseAutoFocus,
  className,
}: LightboxProps) {
  const [inner, setInner] = useState(defaultIndex)
  // proporção real da foto (largura / altura), para ampliá-la sem distorcer; 4:3 até carregar
  const [loaded, setLoaded] = useState<{ src: string; ratio: number } | null>(null)
  const count = items.length
  const current = Math.min(Math.max(index ?? inner, 0), Math.max(count - 1, 0))
  const item = items[current]

  const ratio = loaded && loaded.src === item?.src ? loaded.ratio : 4 / 3

  function go(next: number) {
    const wrapped = (next + count) % count
    if (index === undefined) setInner(wrapped)
    onIndexChange?.(wrapped)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (count < 2) return
    if (event.key === 'ArrowRight') go(current + 1)
    else if (event.key === 'ArrowLeft') go(current - 1)
  }

  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlayStyles} />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={onCloseAutoFocus}
          onKeyDown={onKeyDown}
          // o conteúdo cobre a tela toda: clicar fora da foto e dos botões fecha
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) onOpenChange?.(false)
          }}
          className={cn(
            fadeStyles,
            'iu:fixed iu:inset-0 iu:z-50 iu:flex iu:flex-col iu:items-center iu:justify-center iu:gap-6 iu:p-4 iu:outline-none',
            className,
          )}
        >
          <Dialog.Title className="iu:sr-only">{label}</Dialog.Title>
          <Dialog.Close asChild>
            <IconButton
              aria-label={closeLabel}
              variant="tertiary"
              className={cn(
                roundButton,
                'iu:absolute iu:top-4 iu:right-4 iu:tablet:top-6 iu:tablet:right-6',
              )}
            >
              <CloseIcon className="iu:size-5" />
            </IconButton>
          </Dialog.Close>
          {item && (
            <div className="iu:relative iu:flex iu:items-center iu:justify-center">
              {count > 1 && (
                <IconButton
                  aria-label={previousLabel}
                  variant="tertiary"
                  onClick={() => go(current - 1)}
                  className={cn(roundButton, 'iu:absolute iu:left-2 iu:z-10 iu:tablet:-left-17')}
                >
                  <PreviousIcon />
                </IconButton>
              )}
              <img
                // a chave reinicia o fade a cada troca de foto
                key={item.src}
                src={item.src}
                alt={item.alt}
                onLoad={({ currentTarget: img }) =>
                  img.naturalWidth &&
                  img.naturalHeight &&
                  setLoaded({ src: item.src, ratio: img.naturalWidth / img.naturalHeight })
                }
                // Cresce até a caixa de 672×504 do Figma (e à tela, se menor), mesmo que o arquivo
                // seja pequeno: a largura é o menor entre o teto e o que a altura máxima permite.
                style={{ '--iu-ratio': ratio, aspectRatio: ratio } as CSSProperties}
                className="iu:motion-safe:animate-fade-in iu:w-[min(672px,calc(100vw-2rem),calc(min(504px,100dvh-8rem)*var(--iu-ratio)))] iu:tablet:w-[min(672px,calc(100vw-12rem),calc(min(504px,100dvh-8rem)*var(--iu-ratio)))] iu:rounded-lg iu:border iu:border-[var(--color-border-default)] iu:object-contain iu:shadow-2xl"
              />
              {count > 1 && (
                <IconButton
                  aria-label={nextLabel}
                  variant="tertiary"
                  onClick={() => go(current + 1)}
                  className={cn(roundButton, 'iu:absolute iu:right-2 iu:z-10 iu:tablet:-right-17')}
                >
                  <NextIcon />
                </IconButton>
              )}
            </div>
          )}
          {count > 1 && (
            <p
              aria-live="polite"
              className="iu:text-sm iu:leading-5 iu:font-medium iu:text-[var(--color-media-on-surface)]"
            >
              {current + 1} / {count}
            </p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
