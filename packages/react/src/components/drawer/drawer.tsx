'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentProps, type ReactNode, useRef } from 'react'
import { cn } from '../../utils/cn'
import { drawerStyles } from '../_shared/motion'
import { overlayStyles } from '../_shared/overlay'
import { CloseIcon } from '../_shared/status'
import { IconButton } from '../icon-button'
import { useSwipeToClose } from './use-swipe-to-close'

const drawerVariants = cva(
  `${drawerStyles} iu:fixed iu:z-50 iu:flex iu:flex-col iu:overflow-hidden iu:border-[var(--color-border-default)] iu:bg-[var(--color-surface-elevated)] iu:shadow-2xl iu:outline-none`,
  {
    variants: {
      side: {
        right:
          'iu:[--iu-slide:100%_0] iu:inset-y-0 iu:right-0 iu:w-[calc(100vw-2rem)] iu:max-w-[400px] iu:border-l',
        left: 'iu:[--iu-slide:-100%_0] iu:inset-y-0 iu:left-0 iu:w-[calc(100vw-2rem)] iu:max-w-[400px] iu:border-r',
        top: 'iu:[--iu-slide:0_-100%] iu:inset-x-0 iu:top-0 iu:max-h-[80vh] iu:border-b',
        bottom: 'iu:[--iu-slide:0_100%] iu:inset-x-0 iu:bottom-0 iu:max-h-[80vh] iu:border-t',
      },
    },
    defaultVariants: { side: 'right' },
  },
)

export type DrawerProps = Pick<
  ComponentProps<typeof Dialog.Root>,
  'open' | 'defaultOpen' | 'onOpenChange'
> &
  VariantProps<typeof drawerVariants> & {
    /** Título do painel; também é o nome acessível dele. */
    title: ReactNode
    /** O corpo do painel, lido por leitores de tela como a descrição dele. */
    children: ReactNode
    /** Ações do rodapé (primária à direita). Use `DrawerClose` para fechar. Sem ele, não há rodapé. */
    footer?: ReactNode
    /** Elemento que abre o painel (ex.: um `<Button>`). Dispensável no modo controlado. */
    trigger?: ReactNode
    /**
     * Arrastar o painel para a borda de onde ele veio fecha (só toque). Não rouba a rolagem do
     * conteúdo nem o toque em campos; `data-no-drag` num elemento tira ele do gesto. Padrão: `true`.
     */
    swipeToClose?: boolean
    /**
     * Barrinha de arraste na borda do painel, que avisa que ele fecha arrastando. Só aparece em
     * `top` e `bottom`, e só com `swipeToClose`. Padrão: `true`.
     */
    showHandle?: boolean
    /** Nome acessível do botão de fechar (×). */
    closeLabel?: string
    className?: string
  }

/**
 * Painel colado a uma borda da tela, para detalhes ou formulários sem sair da página.
 * Bloqueia o conteúdo de trás como o Modal: backdrop, foco preso e `Esc` para fechar.
 */
export function Drawer({
  open,
  defaultOpen,
  onOpenChange,
  title,
  children,
  footer,
  trigger,
  closeLabel = 'Fechar',
  swipeToClose = true,
  showHandle = true,
  side,
  className,
}: DrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const edge = side ?? 'right'
  const { panelRef, overlayRef } = useSwipeToClose(edge, swipeToClose, closeRef)
  const hasHandle = showHandle && swipeToClose && (edge === 'top' || edge === 'bottom')
  const handle = hasHandle && (
    // Figma "Drawer/navigation": traço de 4px em `border/strong`, numa faixa de 24px. As variantes
    // sm (108px) e xl (40px) viraram mobile e desktop (o `xl` do DS é o `desktop`, 1440px).
    <div
      aria-hidden="true"
      className="iu:flex iu:h-6 iu:shrink-0 iu:items-center iu:justify-center"
    >
      <span className="iu:h-1 iu:w-[108px] iu:rounded-lg iu:bg-[var(--color-border-strong)] iu:desktop:w-10" />
    </div>
  )
  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay ref={overlayRef} className={overlayStyles} />
        <Dialog.Content ref={panelRef} className={cn(drawerVariants({ side }), className)}>
          {edge === 'bottom' && handle}
          {/* ao lado da barrinha, o conteúdo vizinho encosta na faixa de 24px (sem somar o padding) */}
          <div
            className={cn(
              'iu:flex iu:items-center iu:gap-4 iu:border-b iu:border-[var(--color-border-default)] iu:px-6 iu:py-4',
              hasHandle && edge === 'bottom' && 'iu:pt-0',
            )}
          >
            <Dialog.Title className="iu:flex-1 iu:text-lg iu:leading-6 iu:font-semibold iu:text-[var(--color-text-primary)]">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <IconButton ref={closeRef} aria-label={closeLabel} variant="ghost" size="sm">
                <CloseIcon />
              </IconButton>
            </Dialog.Close>
          </div>
          <Dialog.Description asChild>
            <div
              className={cn(
                'iu:flex iu:flex-1 iu:flex-col iu:gap-4 iu:overflow-y-auto iu:p-6 iu:text-sm iu:leading-5 iu:text-[var(--color-text-secondary)]',
                hasHandle && edge === 'top' && !footer && 'iu:pb-2',
              )}
            >
              {children}
            </div>
          </Dialog.Description>
          {footer && (
            <div
              className={cn(
                'iu:flex iu:items-center iu:justify-end iu:gap-2 iu:border-t iu:border-[var(--color-border-default)] iu:px-6 iu:py-4',
                hasHandle && edge === 'top' && 'iu:pb-0',
              )}
            >
              {footer}
            </div>
          )}
          {edge === 'top' && handle}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Fecha o painel ao clicar. Use com `asChild` em volta de um `<Button>` do rodapé. */
export const DrawerClose = Dialog.Close
