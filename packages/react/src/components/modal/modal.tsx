'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { CloseIcon } from '../_shared/status'
import { IconButton } from '../icon-button'

const modalVariants = cva(
  'iu:fixed iu:top-1/2 iu:left-1/2 iu:z-50 iu:flex iu:max-h-[calc(100vh-2rem)] iu:w-[calc(100vw-2rem)] iu:-translate-x-1/2 iu:-translate-y-1/2 iu:flex-col iu:overflow-hidden iu:rounded-lg iu:border iu:border-[var(--color-border-default)] iu:bg-[var(--color-surface-elevated)] iu:shadow-2xl iu:outline-none',
  {
    variants: {
      size: { sm: 'iu:max-w-[480px]', md: 'iu:max-w-[640px]', lg: 'iu:max-w-[800px]' },
    },
    defaultVariants: { size: 'sm' },
  },
)

export type ModalProps = Pick<
  ComponentProps<typeof Dialog.Root>,
  'open' | 'defaultOpen' | 'onOpenChange'
> &
  VariantProps<typeof modalVariants> & {
    /** Título do diálogo; também é o nome acessível dele. */
    title: ReactNode
    /** O corpo do diálogo, lido por leitores de tela como a descrição dele. */
    children: ReactNode
    /** Ações do rodapé (primária à direita). Use `ModalClose` para fechar. Sem ele, não há rodapé. */
    footer?: ReactNode
    /** Elemento que abre o modal (ex.: um `<Button>`). Dispensável no modo controlado. */
    trigger?: ReactNode
    /** Mostra o botão de fechar (×) no cabeçalho. */
    showClose?: boolean
    /** Linha entre o cabeçalho e o corpo. Padrão: `true`. */
    showHeaderDivider?: boolean
    /** Linha entre o corpo e o rodapé (só aparece com `footer`). Padrão: `true`. */
    showFooterDivider?: boolean
    /** Nome acessível do botão de fechar. */
    closeLabel?: string
    className?: string
  }

/** Diálogo que bloqueia o conteúdo de trás, com backdrop, foco preso e `Esc` para fechar. */
export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  title,
  children,
  footer,
  trigger,
  showClose = true,
  showHeaderDivider = true,
  showFooterDivider = true,
  closeLabel = 'Fechar',
  size,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="iu:fixed iu:inset-0 iu:z-50 iu:bg-[var(--color-surface-overlay)] iu:opacity-(--surface-overlay-opacity)" />
        <Dialog.Content className={cn(modalVariants({ size }), className)}>
          <div
            className={cn(
              'iu:flex iu:items-center iu:gap-4 iu:px-6 iu:py-4',
              showHeaderDivider && 'iu:border-b iu:border-[var(--color-border-default)]',
            )}
          >
            <Dialog.Title className="iu:flex-1 iu:text-lg iu:leading-6 iu:font-semibold iu:text-[var(--color-text-primary)]">
              {title}
            </Dialog.Title>
            {showClose && (
              <Dialog.Close asChild>
                <IconButton aria-label={closeLabel} variant="ghost" size="sm">
                  <CloseIcon />
                </IconButton>
              </Dialog.Close>
            )}
          </div>
          <Dialog.Description asChild>
            <div className="iu:flex iu:flex-col iu:gap-4 iu:overflow-y-auto iu:p-6 iu:text-sm iu:leading-5 iu:text-[var(--color-text-secondary)]">
              {children}
            </div>
          </Dialog.Description>
          {footer && (
            <div
              className={cn(
                'iu:flex iu:items-center iu:justify-end iu:gap-2 iu:px-6 iu:py-4',
                showFooterDivider && 'iu:border-t iu:border-[var(--color-border-default)]',
              )}
            >
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Fecha o modal ao clicar. Use com `asChild` em volta de um `<Button>` do rodapé. */
export const ModalClose = Dialog.Close
