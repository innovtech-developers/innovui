/// <reference types="uniwind/types" />

import { createContext, type ReactNode, useContext } from 'react'
import { Pressable, type PressableProps, Text, View } from 'react-native'
import { cn } from '../../utils/cn'
import { AnchoredOverlay } from '../_shared/anchored-overlay'
import { AnchorTrigger, useControlledAnchor } from '../_shared/overlay-anchor'
import { useOpenState } from '../_shared/overlay-state'

const CloseContext = createContext<(() => void) | null>(null)

export type MenuProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Lado do gatilho em que o menu abre; inverte se não couber. Padrão: `bottom`. */
  side?: 'top' | 'bottom'
  /** Elemento que abre o menu (ex.: um `<Button>`); recebe `onPress`. */
  trigger: ReactNode
  /** Os `MenuItem`, `MenuLabel` e `MenuSeparator` do menu. */
  children: ReactNode
  className?: string
  testID?: string
}

/**
 * Menu de ações aberto por um botão, ancorado nele. Tocar num item o executa e fecha o menu;
 * tocar fora ou o botão voltar do Android também fecha. Diferenças do web: sem navegação por
 * teclado, sem `align` (alinha à esquerda do gatilho) e sem lados `left`/`right`.
 */
export function Menu({
  open,
  defaultOpen,
  onOpenChange,
  side = 'bottom',
  trigger,
  children,
  className,
  testID,
}: MenuProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange })
  const { ref, rect } = useControlledAnchor(isOpen)
  const close = () => setOpen(false)

  return (
    <>
      <AnchorTrigger anchorRef={ref} event="onPress" onTrigger={() => setOpen(!isOpen)}>
        {trigger}
      </AnchorTrigger>
      <AnchoredOverlay
        visible={isOpen}
        rect={rect}
        onRequestClose={close}
        placement={side}
        testID={testID}
        className={cn(
          'min-w-[180px] rounded-[8px] border border-border-default bg-surface-elevated p-1 shadow-md',
          className,
        )}
      >
        <CloseContext.Provider value={close}>
          <View accessibilityRole="menu">{children}</View>
        </CloseContext.Provider>
      </AnchoredOverlay>
    </>
  )
}

export type MenuItemProps = Omit<PressableProps, 'children' | 'style'> & {
  /** Chamado ao escolher o item (antes de o menu fechar). Equivale ao `onSelect` do web. */
  onSelect?: () => void
  /** Ícone à esquerda do rótulo (16px). */
  icon?: ReactNode
  /** Ação que desfaz dados (excluir, remover): texto em vermelho. */
  destructive?: boolean
  children: string
  className?: string
}

/** Uma ação do menu. Usa `onSelect` (como o web); `onPress` também é chamado. */
export function MenuItem({
  className,
  icon,
  destructive = false,
  disabled,
  onSelect,
  onPress,
  children,
  accessibilityState,
  ...props
}: MenuItemProps) {
  const close = useContext(CloseContext)

  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ ...accessibilityState, disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={(event) => {
        onPress?.(event)
        onSelect?.()
        close?.()
      }}
      className={cn(
        'flex-row items-center gap-2 rounded-sm px-3 py-2 active:bg-bg-tertiary',
        className,
      )}
      {...props}
    >
      {icon}
      <Text
        className={cn(
          'text-sm leading-5',
          disabled
            ? 'text-text-disabled'
            : destructive
              ? 'text-status-error-text'
              : 'text-text-primary',
        )}
      >
        {children}
      </Text>
    </Pressable>
  )
}

export type MenuLabelProps = { children: string; className?: string }

/** Título de um grupo de itens. */
export function MenuLabel({ className, children }: MenuLabelProps) {
  return (
    <Text
      className={cn('px-3 py-1.5 text-xs font-medium leading-4 text-text-secondary', className)}
    >
      {children}
    </Text>
  )
}

export type MenuSeparatorProps = { className?: string }

/** Linha entre grupos de itens. */
export function MenuSeparator({ className }: MenuSeparatorProps) {
  return <View className={cn('-mx-1 my-1 h-px bg-border-default', className)} />
}
