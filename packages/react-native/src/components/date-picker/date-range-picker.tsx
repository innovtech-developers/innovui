/// <reference types="uniwind/types" />

import { useState } from 'react'
import { View } from 'react-native'
import { Button } from '../button/button'
import { Calendar } from './calendar'
import type { DatePickerProps } from './date-picker'
import { type DatePreset, getDatePresets } from './date-presets'
import { DateSheet } from './date-sheet'
import { DateTrigger } from './date-trigger'
import { type DateRange, isSameDay, startOfDay } from './dates'

export type DateRangePickerProps = Omit<
  DatePickerProps,
  'value' | 'defaultValue' | 'onValueChange' | 'placeholder'
> & {
  /** Período escolhido (modo controlado). Sem `to`, só o início foi escolhido. */
  value?: DateRange
  defaultValue?: DateRange
  /** Chamado a cada toque: primeiro com só o início, depois com o período completo. */
  onValueChange?: (range: DateRange) => void
  placeholder?: string
  /**
   * Atalhos de período acima do calendário ("Últimos 7 dias"). `true` usa os padrão de
   * `getDatePresets()`; ou passe a sua lista. Atalhos fora de `minDate`/`maxDate` ficam desabilitados.
   */
  presets?: boolean | DatePreset[]
}

/**
 * Campo de período: um gatilho que mostra o início e o fim e abre um Calendar para escolher os dois
 * dias. No native os atalhos ficam numa linha quebrável acima do calendário (sem coluna lateral).
 */
export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  minDate,
  maxDate,
  locale = 'pt-BR',
  weekStartsOn,
  placeholder = 'dd/mm/aaaa – dd/mm/aaaa',
  presets,
  size,
  error,
  disabled,
  readOnly,
  className,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: DateRangePickerProps) {
  const [inner, setInner] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const range = value ?? inner
  const format = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const text = range?.from
    ? `${format.format(range.from)} – ${range.to ? format.format(range.to) : '…'}`
    : undefined
  const visible = open && !readOnly && !disabled

  const shortcuts = presets === true ? getDatePresets() : presets || []
  const outOfBounds = ({ range: r }: DatePreset) =>
    (minDate !== undefined && r.from < startOfDay(minDate)) ||
    (maxDate !== undefined && r.to > startOfDay(maxDate))
  const isActive = ({ range: r }: DatePreset) =>
    range?.from !== undefined &&
    range.to !== undefined &&
    isSameDay(range.from, r.from) &&
    isSameDay(range.to, r.to)

  function apply(next: DateRange, close: boolean) {
    if (value === undefined) setInner(next)
    onValueChange?.(next)
    if (close) setOpen(false)
  }

  return (
    <>
      <DateTrigger
        text={text}
        placeholder={placeholder}
        size={size}
        error={error}
        open={visible}
        disabled={disabled}
        readOnly={readOnly}
        onPress={() => setOpen(true)}
        className={className}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        testID={testID}
      />
      <DateSheet
        visible={visible}
        onRequestClose={() => setOpen(false)}
        testID={testID ? `${testID}-sheet` : undefined}
      >
        <View className="gap-3">
          {shortcuts.length > 0 && (
            <View className="w-70 flex-row flex-wrap gap-1">
              {shortcuts.map((preset) => (
                <Button
                  key={preset.label}
                  size="sm"
                  variant={isActive(preset) ? 'secondary' : 'ghost'}
                  accessibilityState={{ selected: isActive(preset) }}
                  disabled={outOfBounds(preset)}
                  onPress={() => apply(preset.range, true)}
                >
                  {preset.label}
                </Button>
              ))}
            </View>
          )}
          <Calendar
            mode="range"
            value={range}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
            weekStartsOn={weekStartsOn}
            onValueChange={(next) => apply(next, next.to !== undefined)}
          />
        </View>
      </DateSheet>
    </>
  )
}
