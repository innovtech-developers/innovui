/// <reference types="uniwind/types" />

import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'
import {
  Pressable,
  type PressableProps,
  ScrollView,
  type ScrollViewProps,
  Text,
  View,
  type ViewProps,
} from 'react-native'
import { cn } from '../../utils/cn'

type TabsContextValue = { value: string | undefined; setValue: (value: string) => void }

const TabsContext = createContext<TabsContextValue>({ value: undefined, setValue: () => {} })

export type TabsProps = ViewProps & {
  className?: string
  /** Aba ativa (controlado). */
  value?: string
  /** Aba ativa inicial (não controlado). */
  defaultValue?: string
  onValueChange?: (value: string) => void
}

/** Raiz das abas: controla qual `Tab` está ativa (`value`/`defaultValue`/`onValueChange`). */
export function Tabs({ className, value, defaultValue, onValueChange, ...props }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value !== undefined ? value : internal

  const context = useMemo(
    () => ({
      value: current,
      setValue: (next: string) => {
        if (value === undefined) setInternal(next)
        onValueChange?.(next)
      },
    }),
    [current, value, onValueChange],
  )

  return (
    <TabsContext.Provider value={context}>
      <View className={className} {...props} />
    </TabsContext.Provider>
  )
}

export type TabListProps = Omit<ScrollViewProps, 'horizontal' | 'style'> & {
  className?: string
}

/** Lista de gatilhos. Rola na horizontal quando as abas não cabem na tela. */
export function TabList({ className, ...props }: TabListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      className={cn('grow-0', className)}
      contentContainerClassName="items-start"
      {...props}
    />
  )
}

export type TabProps = Omit<PressableProps, 'children' | 'style'> & {
  className?: string
  /** Valor que liga a aba ao `TabPanel` de mesmo `value`. */
  value: string
  /** Ícone à esquerda do rótulo (ex.: um ícone SVG de 24px). */
  icon?: ReactNode
  children?: ReactNode
}

export function Tab({
  className,
  value,
  icon,
  children,
  disabled,
  onPress,
  accessibilityState,
  ...props
}: TabProps) {
  const { value: active, setValue } = useContext(TabsContext)
  const selected = active === value

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ ...accessibilityState, selected, disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={(event) => {
        setValue(value)
        onPress?.(event)
      }}
      className={cn('items-start gap-[6px] px-3 pt-2', className)}
      {...props}
    >
      <View className="flex-row items-center gap-1">
        {icon}
        {typeof children === 'string' ? (
          <Text
            className={cn(
              'text-sm text-text-secondary',
              selected && 'font-medium text-text-brand',
              disabled && 'text-text-disabled',
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
      <View
        className={cn('h-0.5 self-stretch bg-transparent', selected && 'bg-interactive-primary')}
      />
    </Pressable>
  )
}

export type TabPanelProps = ViewProps & {
  className?: string
  value: string
}

/** Painel da aba: só é montado enquanto a aba de mesmo `value` está ativa (igual ao web). */
export function TabPanel({ className, value, ...props }: TabPanelProps) {
  const { value: active } = useContext(TabsContext)
  if (active !== value) return null
  return <View className={className} {...props} />
}
