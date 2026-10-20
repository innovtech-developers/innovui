/// <reference types="uniwind/types" />

import {
  Children,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useState,
} from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { cn } from '../../utils/cn'
import { AnchoredOverlay, useAnchor } from '../_shared/anchored-overlay'
import { CheckIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'
import { type FieldSize, FieldTrigger } from './field-trigger'

type SelectContextValue = { value: string | undefined; onSelect: (value: string) => void }
const SelectContext = createContext<SelectContextValue>({ value: undefined, onSelect: () => {} })

export type SelectProps = {
  /** Opções: um ou mais `<SelectOption>`. */
  children: ReactNode
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  /** Mostra o valor mas nunca abre a lista, como um `<TextInput editable={false}>`. */
  readOnly?: boolean
  error?: boolean
  size?: FieldSize
  className?: string
  accessibilityLabel?: string
  accessibilityHint?: string
  testID?: string
}

export type SelectOptionProps = {
  value: string
  disabled?: boolean
  children: ReactNode
}

// Procura o rótulo da opção escolhida nos filhos (inclusive dentro de Fragments).
function findLabel(children: ReactNode, value: string | undefined): ReactNode | undefined {
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue
    const element = child as ReactElement<{ value?: string; children?: ReactNode }>
    if (element.type === SelectOption && element.props.value === value)
      return element.props.children
    const nested = findLabel(element.props.children, value)
    if (nested !== undefined) return nested
  }
  return undefined
}

/**
 * Campo de escolha única. Toque no gatilho abre a lista numa camada ancorada (largura do gatilho,
 * rolável). Diferenças do web: sem navegação por teclado, sem `name`/`required`/`id` (não há
 * formulário nativo).
 */
export function Select({
  children,
  placeholder = 'Selecione...',
  value,
  defaultValue,
  onValueChange,
  size,
  error,
  disabled,
  readOnly = false,
  className,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: SelectProps) {
  const [inner, setInner] = useState(defaultValue)
  const selected = value ?? inner
  const anchor = useAnchor()
  const open = anchor.visible && !disabled && !readOnly

  function onSelect(next: string) {
    if (value === undefined) setInner(next)
    onValueChange?.(next)
    anchor.close()
  }

  return (
    <>
      <FieldTrigger
        anchorRef={anchor.ref}
        icon="chevron"
        text={selected === undefined ? undefined : findLabel(children, selected)}
        placeholder={placeholder}
        size={size}
        error={error}
        open={open}
        disabled={disabled}
        readOnly={readOnly}
        onPress={anchor.open}
        className={className}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        testID={testID}
      />
      <AnchoredOverlay
        visible={open}
        rect={anchor.rect}
        onRequestClose={anchor.close}
        matchAnchorWidth
        testID={testID ? `${testID}-list` : undefined}
        className="overflow-hidden rounded-md border border-select-dropdown-border bg-select-dropdown-bg p-1 shadow-md"
      >
        <SelectContext.Provider value={{ value: selected, onSelect }}>
          <ScrollView className="max-h-60">{children}</ScrollView>
        </SelectContext.Provider>
      </AnchoredOverlay>
    </>
  )
}

/** Opção da lista do Select. O `children` é o rótulo mostrado na lista e no gatilho. */
export function SelectOption({ value, disabled, children }: SelectOptionProps) {
  const ctx = useContext(SelectContext)
  const selected = ctx.value === value
  const checkColor = useToken('--color-select-option-text')

  return (
    <Pressable
      role="option"
      accessibilityState={{ selected, disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={() => ctx.onSelect(value)}
      className={cn(
        'flex-row items-center gap-2 rounded-sm px-3 py-2 active:bg-select-option-bg-hover',
        selected && 'bg-select-option-bg-selected',
      )}
    >
      <Text
        className={cn(
          'flex-1 text-base text-select-option-text',
          disabled && 'text-select-option-text-disabled',
        )}
      >
        {children}
      </Text>
      {selected ? (
        <View className="size-4 items-center justify-center">
          <CheckIcon color={checkColor} />
        </View>
      ) : null}
    </Pressable>
  )
}
