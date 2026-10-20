'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { ChevronRightIcon } from '../_shared/status'
import { IconButton } from '../icon-button'
import {
  addDays,
  addMonths,
  clamp,
  type DateRange,
  isSameDay,
  monthWeeks,
  pickRange,
  startOfDay,
  toISODate,
} from './dates'

type CalendarCommon = {
  /** Primeiro dia que pode ser escolhido. */
  minDate?: Date
  /** Último dia que pode ser escolhido. */
  maxDate?: Date
  /** Idioma dos nomes de mês e dia (BCP 47). */
  locale?: string
  /** Primeiro dia da semana: 0 = domingo (padrão), 1 = segunda. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Foca o dia ao montar, para o calendário aberto dentro de um Popover. */
  autoFocus?: boolean
  previousMonthLabel?: string
  nextMonthLabel?: string
  className?: string
}

export type CalendarProps = CalendarCommon &
  (
    | {
        /** `single` (padrão) escolhe um dia; `range` escolhe um período (início e fim). */
        mode?: 'single'
        /** Dia selecionado (modo controlado). */
        value?: Date
        defaultValue?: Date
        onValueChange?: (date: Date) => void
      }
    | {
        mode: 'range'
        /** Período selecionado (modo controlado). Sem `to`, só o início foi escolhido. */
        value?: DateRange
        defaultValue?: DateRange
        /** Chamado a cada clique: primeiro com só o início, depois com o período completo. */
        onValueChange?: (range: DateRange) => void
      }
  )

/** Calendário de um mês para escolher um dia ou um período, com navegação completa por teclado. */
export function Calendar({
  minDate,
  maxDate,
  locale = 'pt-BR',
  weekStartsOn = 0,
  autoFocus = false,
  previousMonthLabel = 'Mês anterior',
  nextMonthLabel = 'Próximo mês',
  className,
  ...selection
}: CalendarProps) {
  const titleId = useId()
  const grid = useRef<HTMLTableElement>(null)
  const wantsFocus = useRef(autoFocus)
  const [inner, setInner] = useState(selection.defaultValue)
  const current = selection.value ?? inner
  const isRange = selection.mode === 'range'
  const range = isRange ? (current as DateRange | undefined) : undefined
  const from = isRange ? range?.from : (current as Date | undefined)
  const to = isRange ? range?.to : from
  const today = startOfDay(new Date())
  // o dia que recebe Tab (roving tabindex); o mês exibido acompanha ele
  const [cursor, setCursor] = useState(() => clamp(startOfDay(from ?? today), minDate, maxDate))

  useEffect(() => {
    if (!wantsFocus.current) return
    wantsFocus.current = false
    grid.current?.querySelector<HTMLElement>(`[data-date="${toISODate(cursor)}"]`)?.focus()
  }, [cursor])

  const monthTitle = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    cursor,
  )
  const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: 'full' })
  const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: 'long' })
  const weeks = monthWeeks(cursor.getFullYear(), cursor.getMonth(), weekStartsOn)
  const headings = (weeks[0] ?? []).map((_, i) => {
    const day = addDays(new Date(2023, 0, 1), weekStartsOn + i) // 1/jan/2023 foi domingo
    return { short: weekdayShort.format(day), long: weekdayLong.format(day) }
  })

  const isDisabled = (d: Date) =>
    (minDate !== undefined && d < startOfDay(minDate)) ||
    (maxDate !== undefined && d > startOfDay(maxDate))
  const canGoPrevious =
    !minDate || new Date(cursor.getFullYear(), cursor.getMonth(), 0) >= startOfDay(minDate)
  const canGoNext =
    !maxDate || new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1) <= startOfDay(maxDate)

  function moveTo(next: Date) {
    wantsFocus.current = true
    setCursor(clamp(next, minDate, maxDate))
  }

  function onKeyDown(e: React.KeyboardEvent, day: Date) {
    const week = (day.getDay() - weekStartsOn + 7) % 7
    const target: Record<string, Date> = {
      ArrowLeft: addDays(day, -1),
      ArrowRight: addDays(day, 1),
      ArrowUp: addDays(day, -7),
      ArrowDown: addDays(day, 7),
      Home: addDays(day, -week),
      End: addDays(day, 6 - week),
      PageUp: addMonths(day, e.shiftKey ? -12 : -1),
      PageDown: addMonths(day, e.shiftKey ? 12 : 1),
    }
    const next = target[e.key]
    if (!next) return
    e.preventDefault()
    moveTo(next)
  }

  function choose(day: Date) {
    if (selection.mode === 'range') {
      const next = pickRange(range, day)
      if (selection.value === undefined) setInner(next)
      selection.onValueChange?.(next)
    } else {
      if (selection.value === undefined) setInner(day)
      selection.onValueChange?.(day)
    }
  }

  const isEdge = (day: Date, edge?: Date) => edge !== undefined && isSameDay(day, edge)
  // período com mais de um dia: só nele há faixa (um dia só fica como um círculo)
  const hasSpan = isRange && from !== undefined && to !== undefined && !isSameDay(from, to)
  const inBand = (day: Date) => from !== undefined && to !== undefined && day > from && day < to

  return (
    <div className={cn('iu:w-[17.5rem] iu:select-none', className)}>
      <div className="iu:mb-2 iu:flex iu:items-center iu:justify-between">
        <IconButton
          aria-label={previousMonthLabel}
          variant="ghost"
          size="sm"
          disabled={!canGoPrevious}
          onClick={() => setCursor(clamp(addMonths(cursor, -1), minDate, maxDate))}
        >
          <ChevronRightIcon className="iu:rotate-180" />
        </IconButton>
        <div
          id={titleId}
          aria-live="polite"
          className="iu:text-sm iu:leading-5 iu:font-medium iu:text-[var(--color-text-primary)] iu:first-letter:uppercase"
        >
          {monthTitle}
        </div>
        <IconButton
          aria-label={nextMonthLabel}
          variant="ghost"
          size="sm"
          disabled={!canGoNext}
          onClick={() => setCursor(clamp(addMonths(cursor, 1), minDate, maxDate))}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
      <table
        ref={grid}
        // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: padrão WAI-ARIA
        role="grid"
        aria-labelledby={titleId}
        className="iu:w-full iu:border-collapse iu:text-center"
      >
        <thead>
          <tr>
            {headings.map((h) => (
              <th
                key={h.long}
                scope="col"
                abbr={h.long}
                className="iu:h-8 iu:text-xs iu:leading-4 iu:font-medium iu:text-[var(--color-text-secondary)] iu:first-letter:uppercase"
              >
                {h.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={toISODate(week.find((d) => d) ?? cursor)}>
              {week.map((day, i) =>
                day ? (
                  // biome-ignore lint/a11y/useFocusableInteractive: o botão dentro da célula é o elemento focável
                  <td
                    key={toISODate(day)}
                    // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: padrão WAI-ARIA
                    role="gridcell"
                    aria-selected={isEdge(day, from) || isEdge(day, to) || inBand(day)}
                    className={cn(
                      'iu:p-0',
                      // faixa contínua entre o início e o fim, com as pontas arredondadas
                      hasSpan &&
                        (inBand(day) || isEdge(day, from) || isEdge(day, to)) &&
                        'iu:bg-[var(--color-button-secondary-bg)]',
                      hasSpan && isEdge(day, from) && 'iu:rounded-l-full',
                      hasSpan && isEdge(day, to) && 'iu:rounded-r-full',
                    )}
                  >
                    <button
                      type="button"
                      data-date={toISODate(day)}
                      tabIndex={isSameDay(day, cursor) ? 0 : -1}
                      disabled={isDisabled(day)}
                      aria-label={fullDate.format(day)}
                      aria-current={isSameDay(day, today) ? 'date' : undefined}
                      onClick={() => choose(day)}
                      onKeyDown={(e) => onKeyDown(e, day)}
                      className={cn(
                        'iu:size-9 iu:cursor-pointer iu:rounded-full iu:text-sm iu:leading-5 iu:text-[var(--color-text-primary)] iu:outline-none iu:transition-colors iu:hover:bg-[var(--color-bg-tertiary)] iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)] iu:disabled:pointer-events-none iu:disabled:text-[var(--color-text-disabled)]',
                        isSameDay(day, today) &&
                          'iu:font-semibold iu:text-[var(--color-text-brand)]',
                        inBand(day) && 'iu:hover:bg-[var(--color-button-secondary-bg-hover)]',
                        (isEdge(day, from) || isEdge(day, to)) &&
                          'iu:bg-[var(--color-button-primary-bg)] iu:font-medium iu:text-[var(--color-button-primary-text)] iu:hover:bg-[var(--color-button-primary-bg-hover)]',
                      )}
                    >
                      {day.getDate()}
                    </button>
                  </td>
                ) : (
                  // biome-ignore lint/suspicious/noArrayIndexKey: células vazias não têm identidade; a posição é a chave
                  <td key={`empty-${i}`} />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
