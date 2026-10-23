/// <reference types="uniwind/types" />

import { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { cn } from '../../utils/cn'
import { AnchoredOverlay, useAnchor } from '../_shared/anchored-overlay'
import { CheckIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'
import { type FieldSize, FieldTrigger } from '../select/field-trigger'

export type ComboboxOption = {
  /** Valor guardado e devolvido em `onValueChange`. */
  value: string
  /** Texto mostrado na lista e no gatilho; também é onde a busca procura. */
  label: string
  disabled?: boolean
}

export type ComboboxProps = {
  options: ComboboxOption[]
  /** Valor selecionado (modo controlado). */
  value?: string
  defaultValue?: string
  /** Chamado com o `value` da opção escolhida. */
  onValueChange?: (value: string) => void
  /** Texto do gatilho sem valor. */
  placeholder?: string
  /** Placeholder do campo de busca dentro da lista. */
  searchPlaceholder?: string
  /** Texto quando a busca não acha nada. */
  emptyMessage?: string
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  size?: FieldSize
  className?: string
  accessibilityLabel?: string
  accessibilityHint?: string
  testID?: string
}

// busca sem distinguir maiúsculas nem acentos: "sao" acha "São Paulo"
const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

/**
 * Campo de escolha com busca. No native o gatilho é um botão (como o Select) e a busca fica num
 * TextInput no topo da lista, que abre já focado: digitar no próprio gatilho não funciona com a
 * lista numa camada acima dele. Diferenças do web: sem navegação por teclado e sem limpar o valor
 * apagando o texto (`onValueChange` só recebe valores de opções).
 */
export function Combobox({
  options,
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Selecione...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum resultado',
  size,
  error,
  disabled,
  readOnly,
  className,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: ComboboxProps) {
  const [inner, setInner] = useState(defaultValue)
  const [query, setQuery] = useState('')
  const anchor = useAnchor()
  const placeholderColor = useToken('--color-field-text-placeholder')
  const checkColor = useToken('--color-select-option-text')
  const selected = value ?? inner
  const selectedLabel = options.find((o) => o.value === selected)?.label
  const open = anchor.visible && !disabled && !readOnly
  const shown = query ? options.filter((o) => fold(o.label).includes(fold(query))) : options

  function close() {
    anchor.close()
    setQuery('')
  }

  function choose(option: ComboboxOption) {
    if (value === undefined) setInner(option.value)
    onValueChange?.(option.value)
    close()
  }

  return (
    <>
      <FieldTrigger
        anchorRef={anchor.ref}
        icon="chevron"
        text={selectedLabel}
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
        onRequestClose={close}
        matchAnchorWidth
        testID={testID ? `${testID}-list` : undefined}
        className="overflow-hidden rounded-[8px] border border-select-dropdown-border bg-select-dropdown-bg shadow-md"
      >
        <TextInput
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          value={query}
          onChangeText={setQuery}
          placeholder={searchPlaceholder}
          placeholderTextColor={placeholderColor}
          accessibilityLabel={searchPlaceholder}
          className="h-11 border-b border-select-dropdown-border px-3 text-[16px] text-field-text"
        />
        <ScrollView className="max-h-60 p-1" keyboardShouldPersistTaps="handled">
          {shown.length === 0 ? (
            <Text className="px-3 py-2 text-base text-text-secondary">{emptyMessage}</Text>
          ) : (
            shown.map((option) => {
              const isSelected = option.value === selected
              return (
                <Pressable
                  key={option.value}
                  role="option"
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected: isSelected, disabled: Boolean(option.disabled) }}
                  disabled={option.disabled}
                  onPress={() => choose(option)}
                  className={cn(
                    'flex-row items-center gap-2 rounded-sm px-3 py-2 active:bg-select-option-bg-hover',
                    isSelected && 'bg-select-option-bg-selected',
                  )}
                >
                  <Text
                    className={cn(
                      'flex-1 text-base text-select-option-text',
                      option.disabled && 'text-select-option-text-disabled',
                    )}
                  >
                    {option.label}
                  </Text>
                  {isSelected ? (
                    <View className="size-4 items-center justify-center">
                      <CheckIcon color={checkColor} />
                    </View>
                  ) : null}
                </Pressable>
              )
            })
          )}
        </ScrollView>
      </AnchoredOverlay>
    </>
  )
}
