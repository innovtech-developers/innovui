/// <reference types="uniwind/types" />

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import {
  LayoutAnimation,
  Platform,
  Pressable,
  type PressableProps,
  Text,
  UIManager,
  View,
  type ViewProps,
} from 'react-native'
import { cn } from '../../utils/cn'
import { ChevronRightIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'

// No Android antigo o LayoutAnimation precisa ser habilitado. Na New Architecture a chamada é no-op.
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

type AccordionContextValue = {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}

const AccordionContext = createContext<AccordionContextValue>({
  isOpen: () => false,
  toggle: () => {},
})

type AccordionBaseProps = Omit<ViewProps, 'children'> & {
  className?: string
  children?: ReactNode
}

export type AccordionProps = AccordionBaseProps &
  (
    | {
        /** Abre uma seção por vez. */
        type: 'single'
        /** Permite fechar a seção aberta (todas recolhidas). */
        collapsible?: boolean
        value?: string
        defaultValue?: string
        /** Recebe o valor aberto, ou `''` quando tudo foi recolhido (igual ao web). */
        onValueChange?: (value: string) => void
      }
    | {
        /** Permite várias seções abertas. */
        type: 'multiple'
        value?: string[]
        defaultValue?: string[]
        onValueChange?: (value: string[]) => void
      }
  )

const toArray = (value: string | string[] | undefined) =>
  value === undefined || value === '' ? [] : Array.isArray(value) ? value : [value]

/**
 * Lista de seções que expandem e recolhem. `type="single"` abre uma por vez (com `collapsible`,
 * dá para fechar todas); `type="multiple"` permite várias abertas. Controlado (`value`) ou não
 * (`defaultValue`). A animação usa `LayoutAnimation`.
 */
export function Accordion(props: AccordionProps) {
  // União discriminada alargada: a lógica abaixo trata os dois modos com `string[]`.
  const {
    className,
    children,
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible: collapsibleProp,
    ...rest
  } = props as AccordionBaseProps & {
    type: 'single' | 'multiple'
    collapsible?: boolean
    value?: string | string[]
    defaultValue?: string | string[]
    onValueChange?: (value: never) => void
  }
  const collapsible = type === 'single' ? Boolean(collapsibleProp) : true

  const [internal, setInternal] = useState<string[]>(() => toArray(defaultValue))
  const open = value !== undefined ? toArray(value) : internal

  const toggle = useCallback(
    (item: string) => {
      let next: string[]
      if (open.includes(item)) {
        if (type === 'single' && !collapsible) return
        next = open.filter((v) => v !== item)
      } else {
        next = type === 'single' ? [item] : [...open, item]
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      if (value === undefined) setInternal(next)
      if (type === 'single') (onValueChange as ((v: string) => void) | undefined)?.(next[0] ?? '')
      else (onValueChange as ((v: string[]) => void) | undefined)?.(next)
    },
    [open, type, collapsible, value, onValueChange],
  )

  const context = useMemo(
    () => ({ isOpen: (v: string) => open.includes(v), toggle }),
    [open, toggle],
  )

  return (
    <AccordionContext.Provider value={context}>
      <View className={cn('w-full', className)} {...rest}>
        {children}
      </View>
    </AccordionContext.Provider>
  )
}

export type AccordionItemProps = Omit<ViewProps, 'children'> & {
  className?: string
  /** Identifica a seção em `value`/`defaultValue` do `Accordion`. */
  value: string
  /** Texto do cabeçalho: é o botão que expande a seção. */
  title: ReactNode
  disabled?: boolean
  /** Repassado ao botão do cabeçalho (ex.: `testID`, `accessibilityLabel`). */
  triggerProps?: Omit<PressableProps, 'children' | 'style' | 'onPress' | 'disabled'>
  children?: ReactNode
}

export function AccordionItem({
  className,
  value,
  title,
  disabled = false,
  triggerProps,
  children,
  ...props
}: AccordionItemProps) {
  const { isOpen, toggle } = useContext(AccordionContext)
  const open = isOpen(value)
  const iconColor = useToken('--color-text-secondary')

  return (
    <View className={cn('border-b border-border-default', className)} {...props}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        onPress={() => toggle(value)}
        className="flex-row items-center justify-between gap-4 py-4"
        {...triggerProps}
      >
        {typeof title === 'string' ? (
          <Text
            className={cn(
              'flex-1 text-sm font-medium text-text-primary',
              disabled && 'text-text-disabled',
            )}
          >
            {title}
          </Text>
        ) : (
          title
        )}
        {/* Valor dinâmico: a rotação depende do estado. */}
        <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
          <ChevronRightIcon color={iconColor} />
        </View>
      </Pressable>
      {open ? (
        <View className="pb-4">
          {typeof children === 'string' ? (
            <Text className="text-sm text-text-secondary">{children}</Text>
          ) : (
            children
          )}
        </View>
      ) : null}
    </View>
  )
}
