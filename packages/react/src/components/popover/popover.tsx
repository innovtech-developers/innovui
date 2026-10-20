'use client'

import * as RadixPopover from '@radix-ui/react-popover'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type PopoverProps = Pick<
  ComponentProps<typeof RadixPopover.Root>,
  'open' | 'defaultOpen' | 'onOpenChange'
> &
  Pick<ComponentProps<typeof RadixPopover.Content>, 'side' | 'align'> & {
    /** Elemento que abre o popover (ex.: um `<Button>`). Precisa aceitar `ref` e foco. */
    trigger: ReactNode
    /** Nome acessível do painel (ele é um diálogo): descreve o que há nele, ex.: "Filtros". */
    label: string
    /** O conteúdo do popover. Pode ter elementos interativos (botões, campos). */
    children: ReactNode
    className?: string
  }

/**
 * Painel flutuante ancorado ao trigger, aberto por clique. Diferente do Tooltip, o conteúdo
 * pode ser interativo: o foco entra no painel, `Esc` ou clicar fora fecha e o foco volta ao trigger.
 */
export function Popover({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  label,
  children,
  side = 'bottom',
  align = 'center',
  className,
}: PopoverProps) {
  return (
    <RadixPopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          side={side}
          align={align}
          sideOffset={8}
          aria-label={label}
          className={cn(
            'iu:z-50 iu:w-max iu:max-w-xs iu:rounded-md iu:border iu:border-[var(--color-border-default)] iu:bg-[var(--color-surface-elevated)] iu:p-4 iu:text-sm iu:leading-5 iu:text-[var(--color-text-primary)] iu:shadow-md iu:outline-none',
            className,
          )}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}

/** Fecha o popover ao clicar. Use com `asChild` em volta de um `<Button>` dentro do conteúdo. */
export const PopoverClose = RadixPopover.Close
