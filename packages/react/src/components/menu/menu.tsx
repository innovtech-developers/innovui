'use client'

import * as RadixMenu from '@radix-ui/react-dropdown-menu'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { popStyles } from '../_shared/motion'

export type MenuProps = Pick<
  ComponentProps<typeof RadixMenu.Root>,
  'open' | 'defaultOpen' | 'onOpenChange'
> &
  Pick<ComponentProps<typeof RadixMenu.Content>, 'side' | 'align'> & {
    /** Elemento que abre o menu (ex.: um `<Button>`). Precisa aceitar `ref` e foco. */
    trigger: ReactNode
    /** Os `MenuItem`, `MenuLabel` e `MenuSeparator` do menu. */
    children: ReactNode
    className?: string
  }

/**
 * Menu de ações aberto por um botão: setas navegam, `Enter` escolhe, letras saltam para o item,
 * `Esc` fecha. Para escolher um valor de formulário, use Select.
 */
export function Menu({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  children,
  side = 'bottom',
  align = 'start',
  className,
}: MenuProps) {
  return (
    <RadixMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <RadixMenu.Trigger asChild>{trigger}</RadixMenu.Trigger>
      <RadixMenu.Portal>
        <RadixMenu.Content
          side={side}
          align={align}
          sideOffset={4}
          className={cn(
            popStyles,
            'iu:origin-[var(--radix-dropdown-menu-content-transform-origin)] iu:z-50 iu:min-w-[180px] iu:rounded-md iu:border iu:border-[var(--color-border-default)] iu:bg-[var(--color-surface-elevated)] iu:p-1 iu:shadow-md iu:outline-none',
            className,
          )}
        >
          {children}
        </RadixMenu.Content>
      </RadixMenu.Portal>
    </RadixMenu.Root>
  )
}

export type MenuItemProps = ComponentProps<typeof RadixMenu.Item> & {
  /** Ícone à esquerda do rótulo (16px). */
  icon?: ReactNode
  /** Ação que desfaz dados (excluir, remover): texto em vermelho. */
  destructive?: boolean
}

/** Uma ação do menu. Use `onSelect` (dispara por clique e por teclado), não `onClick`. */
export function MenuItem({
  className,
  icon,
  destructive = false,
  children,
  ...props
}: MenuItemProps) {
  return (
    <RadixMenu.Item
      className={cn(
        'iu:flex iu:cursor-pointer iu:items-center iu:gap-2 iu:rounded-sm iu:px-3 iu:py-2 iu:text-sm iu:leading-5 iu:outline-none iu:select-none iu:data-[highlighted]:bg-[var(--color-bg-tertiary)] iu:data-[disabled]:pointer-events-none iu:data-[disabled]:text-[var(--color-text-disabled)] iu:[&_svg]:size-4 iu:[&_svg]:shrink-0',
        destructive
          ? 'iu:text-[var(--color-status-error-text)]'
          : 'iu:text-[var(--color-text-primary)]',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </RadixMenu.Item>
  )
}

export type MenuLabelProps = ComponentProps<typeof RadixMenu.Label>

/** Título de um grupo de itens. */
export function MenuLabel({ className, ...props }: MenuLabelProps) {
  return (
    <RadixMenu.Label
      className={cn(
        'iu:px-3 iu:py-1.5 iu:text-xs iu:leading-4 iu:font-medium iu:text-[var(--color-text-secondary)]',
        className,
      )}
      {...props}
    />
  )
}

export type MenuSeparatorProps = ComponentProps<typeof RadixMenu.Separator>

/** Linha entre grupos de itens. */
export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return (
    <RadixMenu.Separator
      className={cn('iu:-mx-1 iu:my-1 iu:h-px iu:bg-[var(--color-border-default)]', className)}
      {...props}
    />
  )
}
