'use client'

import { useState } from 'react'
import { Button } from '../button'
import { Popover } from '../popover'
import { Calendar } from './calendar'
import type { DatePickerProps } from './date-picker'
import { type DatePreset, getDatePresets } from './date-presets'
import { DateTrigger } from './date-trigger'
import { type DateRange, isSameDay, startOfDay, toISODate } from './dates'

export type DateRangePickerProps = Omit<
  DatePickerProps,
  'value' | 'defaultValue' | 'onValueChange' | 'name' | 'placeholder'
> & {
  /** Período escolhido (modo controlado). Sem `to`, só o início foi escolhido. */
  value?: DateRange
  defaultValue?: DateRange
  /** Chamado a cada clique: primeiro com só o início, depois com o período completo. */
  onValueChange?: (range: DateRange) => void
  placeholder?: string
  /**
   * Atalhos de período ao lado do calendário ("Últimos 7 dias"). `true` usa os padrão de
   * `getDatePresets()`; ou passe a sua lista. Atalhos fora de `minDate`/`maxDate` ficam desabilitados.
   */
  presets?: boolean | DatePreset[]
  /** Nome do campo do início no formulário; envia `aaaa-mm-dd`. */
  fromName?: string
  /** Nome do campo do fim no formulário; envia `aaaa-mm-dd`. */
  toName?: string
}

/** Campo de período: um botão que mostra o início e o fim e abre um Calendar para escolher os dois dias. */
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
  fromName,
  toName,
  size,
  error,
  disabled,
  readOnly,
  className,
  ...props
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
      <Popover
        label="Escolher período"
        align="start"
        // com atalhos, o painel precisa de mais que os 20rem padrão do Popover
        className={shortcuts.length > 0 ? 'iu:max-w-none' : undefined}
        open={open && !readOnly}
        onOpenChange={setOpen}
        trigger={
          <DateTrigger
            disabled={disabled}
            readOnly={readOnly}
            size={size}
            error={error}
            text={text}
            placeholder={placeholder}
            className={className}
            {...props}
          />
        }
      >
        <div className="iu:flex iu:flex-col iu:gap-4 iu:tablet:flex-row">
          {shortcuts.length > 0 && (
            <div className="iu:flex iu:flex-wrap iu:content-start iu:gap-1 iu:tablet:w-40 iu:tablet:flex-col iu:tablet:flex-nowrap iu:tablet:border-r iu:tablet:border-[var(--color-border-default)] iu:tablet:pr-4">
              {shortcuts.map((preset) => (
                <Button
                  key={preset.label}
                  size="sm"
                  variant={isActive(preset) ? 'secondary' : 'ghost'}
                  aria-pressed={isActive(preset)}
                  disabled={outOfBounds(preset)}
                  className="iu:tablet:justify-start"
                  onClick={() => apply(preset.range, true)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}
          <Calendar
            mode="range"
            autoFocus
            value={range}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
            weekStartsOn={weekStartsOn}
            onValueChange={(next) => apply(next, next.to !== undefined)}
          />
        </div>
      </Popover>
      {fromName && (
        <input type="hidden" name={fromName} value={range?.from ? toISODate(range.from) : ''} />
      )}
      {toName && <input type="hidden" name={toName} value={range?.to ? toISODate(range.to) : ''} />}
    </>
  )
}
