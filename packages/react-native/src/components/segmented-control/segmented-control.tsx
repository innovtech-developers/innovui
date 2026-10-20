/// <reference types="uniwind/types" />

import { createContext, type ReactNode, useContext, useState } from 'react'
import { Pressable, type PressableProps, Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

type SegmentedContext = { value: string | undefined; select: (value: string) => void }

const Context = createContext<SegmentedContext | null>(null)

export type SegmentedControlProps = Omit<ViewProps, 'style'> & {
  className?: string
  /** Obrigatório: descreve o que o controle escolhe (ex.: "Modo de exibição"). */
  accessibilityLabel: string
  /** Controlado. Sem ele, o componente guarda o próprio estado (começa em `defaultValue`). */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

/** Escolha única entre 2–5 views do mesmo conteúdo. Para navegar entre seções, use Tabs. */
export function SegmentedControl({
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: SegmentedControlProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const current = value ?? uncontrolled

  const select = (next: string) => {
    if (next === current) return
    setUncontrolled(next)
    onValueChange?.(next)
  }

  return (
    <Context.Provider value={{ value: current, select }}>
      <View
        accessibilityRole="radiogroup"
        className={cn(
          'flex-row items-start gap-1 self-start rounded-md bg-bg-tertiary p-1',
          className,
        )}
        {...props}
      />
    </Context.Provider>
  )
}

export type SegmentedItemProps = Omit<PressableProps, 'style' | 'children' | 'onPress'> & {
  className?: string
  value: string
  children: ReactNode
}

export function SegmentedItem({
  className,
  value,
  children,
  disabled,
  accessibilityState,
  ...props
}: SegmentedItemProps) {
  const group = useContext(Context)
  if (!group) throw new Error('SegmentedItem deve ser usado dentro de SegmentedControl')

  const checked = group.value === value
  const isDisabled = Boolean(disabled)

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ ...accessibilityState, checked, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => group.select(value)}
      className={cn(
        'items-center justify-center rounded-md px-4 py-2',
        checked ? 'bg-surface-primary shadow-sm' : 'active:bg-bg-secondary',
        className,
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          className={cn(
            'text-sm leading-5 text-text-secondary',
            checked && 'font-medium text-text-primary',
            isDisabled && 'text-text-disabled',
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
}
