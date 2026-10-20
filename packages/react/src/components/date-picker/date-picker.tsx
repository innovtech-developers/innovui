'use client'

import type { VariantProps } from 'class-variance-authority'
import { useState } from 'react'
import type { inputVariants } from '../input/input'
import { Popover } from '../popover'
import { Calendar, type CalendarProps } from './calendar'
import { DateTrigger } from './date-trigger'
import { toISODate } from './dates'

export type DatePickerProps = Pick<
  CalendarProps,
  'minDate' | 'maxDate' | 'locale' | 'weekStartsOn'
> &
  Omit<VariantProps<typeof inputVariants>, 'error'> & {
    /** Dia selecionado (modo controlado). */
    value?: Date
    defaultValue?: Date
    /** Chamado com o dia escolhido. */
    onValueChange?: (date: Date) => void
    placeholder?: string
    /** Nome do campo no formulário; envia `aaaa-mm-dd`. */
    name?: string
    id?: string
    disabled?: boolean
    /** Mostra a data mas não deixa trocar. */
    readOnly?: boolean
    error?: boolean
    className?: string
    'aria-describedby'?: string
    'aria-label'?: string
  }

/** Campo de data: um botão que mostra o dia escolhido e abre um Calendar. */
export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  minDate,
  maxDate,
  locale = 'pt-BR',
  weekStartsOn,
  placeholder = 'dd/mm/aaaa',
  name,
  size,
  error,
  disabled,
  readOnly,
  className,
  ...props
}: DatePickerProps) {
  const [inner, setInner] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const selected = value ?? inner
  const text = selected
    ? new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        selected,
      )
    : undefined

  return (
    <>
      <Popover
        label="Escolher data"
        align="start"
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
        <Calendar
          autoFocus
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
      </Popover>
      {name && <input type="hidden" name={name} value={selected ? toISODate(selected) : ''} />}
    </>
  )
}
