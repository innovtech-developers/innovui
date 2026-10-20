import { useState } from 'react'
import type { FieldSize } from '../select/field-trigger'
import { Calendar, type CalendarProps } from './calendar'
import { DateSheet } from './date-sheet'
import { DateTrigger } from './date-trigger'

export type DatePickerProps = Pick<
  CalendarProps,
  'minDate' | 'maxDate' | 'locale' | 'weekStartsOn'
> & {
  /** Dia selecionado (modo controlado). */
  value?: Date
  defaultValue?: Date
  /** Chamado com o dia escolhido. */
  onValueChange?: (date: Date) => void
  placeholder?: string
  size?: FieldSize
  disabled?: boolean
  /** Mostra a data mas não deixa trocar. */
  readOnly?: boolean
  error?: boolean
  className?: string
  accessibilityLabel?: string
  accessibilityHint?: string
  testID?: string
}

/** Campo de data: um gatilho que mostra o dia escolhido e abre um Calendar num painel modal. */
export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  minDate,
  maxDate,
  locale = 'pt-BR',
  weekStartsOn,
  placeholder = 'dd/mm/aaaa',
  size,
  error,
  disabled,
  readOnly,
  className,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: DatePickerProps) {
  const [inner, setInner] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const selected = value ?? inner
  const text = selected
    ? new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        selected,
      )
    : undefined
  const visible = open && !readOnly && !disabled

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
        <Calendar
          value={selected}
          minDate={minDate}
          maxDate={maxDate}
          locale={locale}
          weekStartsOn={weekStartsOn}
          onValueChange={(day) => {
            if (value === undefined) setInner(day)
            onValueChange?.(day)
            setOpen(false)
          }}
        />
      </DateSheet>
    </>
  )
}
