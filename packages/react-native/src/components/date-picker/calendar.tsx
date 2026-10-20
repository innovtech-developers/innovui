/// <reference types="uniwind/types" />

import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { cn } from '../../utils/cn'
import { ChevronRightIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'
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
  previousMonthLabel?: string
  nextMonthLabel?: string
  className?: string
  testID?: string
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
        /** Chamado a cada toque: primeiro com só o início, depois com o período completo. */
        onValueChange?: (range: DateRange) => void
      }
  )

/**
 * Calendário de um mês para escolher um dia ou um período, em RN puro (sem dependência nativa).
 * Sem navegação por teclado nem `autoFocus` (não se aplicam ao native).
 */
export function Calendar({
  minDate,
  maxDate,
  locale = 'pt-BR',
  weekStartsOn = 0,
  previousMonthLabel = 'Mês anterior',
  nextMonthLabel = 'Próximo mês',
  className,
  testID,
  ...selection
}: CalendarProps) {
  const [inner, setInner] = useState(selection.defaultValue)
  const current = selection.value ?? inner
  const isRange = selection.mode === 'range'
  const range = isRange ? (current as DateRange | undefined) : undefined
  const from = isRange ? range?.from : (current as Date | undefined)
  const to = isRange ? range?.to : from
  const today = startOfDay(new Date())
  // o mês exibido: começa no valor (ou hoje) e muda pelas setas
  const [cursor, setCursor] = useState(() => clamp(startOfDay(from ?? today), minDate, maxDate))
  const chevronColor = useToken('--color-text-primary')

  const monthTitle = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    cursor,
  )
  // equivale a dateStyle: 'full', mas com opções explícitas (mais compatível com o Hermes)
  const fullDate = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const weeks = monthWeeks(cursor.getFullYear(), cursor.getMonth(), weekStartsOn)
  const headings = (weeks[0] ?? []).map((_, i) => {
    const day = addDays(new Date(2023, 0, 1), weekStartsOn + i) // 1/jan/2023 foi domingo
    return weekdayShort.format(day)
  })

  const isDisabled = (d: Date) =>
    (minDate !== undefined && d < startOfDay(minDate)) ||
    (maxDate !== undefined && d > startOfDay(maxDate))
  const canGoPrevious =
    !minDate || new Date(cursor.getFullYear(), cursor.getMonth(), 0) >= startOfDay(minDate)
  const canGoNext =
    !maxDate || new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1) <= startOfDay(maxDate)

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
    <View testID={testID} className={cn('w-70', className)}>
      <View className="mb-2 flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={previousMonthLabel}
          accessibilityState={{ disabled: !canGoPrevious }}
          disabled={!canGoPrevious}
          onPress={() => setCursor(clamp(addMonths(cursor, -1), minDate, maxDate))}
          className="size-9 items-center justify-center rounded-full active:bg-button-secondary-bg-hover disabled:opacity-40"
        >
          <View className="rotate-180">
            <ChevronRightIcon color={chevronColor} />
          </View>
        </Pressable>
        <Text
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
          className="text-sm font-medium capitalize text-text-primary"
        >
          {monthTitle}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={nextMonthLabel}
          accessibilityState={{ disabled: !canGoNext }}
          disabled={!canGoNext}
          onPress={() => setCursor(clamp(addMonths(cursor, 1), minDate, maxDate))}
          className="size-9 items-center justify-center rounded-full active:bg-button-secondary-bg-hover disabled:opacity-40"
        >
          <ChevronRightIcon color={chevronColor} />
        </Pressable>
      </View>
      <View className="flex-row">
        {headings.map((heading, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a posição na semana é a identidade
          <View key={i} accessible={false} className="h-8 flex-1 items-center justify-center">
            <Text className="text-xs font-medium capitalize text-text-secondary">{heading}</Text>
          </View>
        ))}
      </View>
      {weeks.map((week) => (
        <View key={toISODate(week.find((d) => d) ?? cursor)} className="flex-row">
          {week.map((day, i) => {
            if (!day) {
              // biome-ignore lint/suspicious/noArrayIndexKey: células vazias não têm identidade
              return <View key={`empty-${i}`} className="h-9 flex-1" />
            }
            const isFrom = isEdge(day, from)
            const isTo = isEdge(day, to)
            const edge = isFrom || isTo
            const isToday = isSameDay(day, today)
            const disabled = isDisabled(day)
            return (
              <View
                key={toISODate(day)}
                className={cn(
                  'h-9 flex-1 items-center',
                  // faixa contínua entre o início e o fim, com as pontas arredondadas
                  hasSpan && (inBand(day) || edge) && 'bg-button-secondary-bg',
                  hasSpan && isFrom && 'rounded-l-full',
                  hasSpan && isTo && 'rounded-r-full',
                )}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={fullDate.format(day)}
                  accessibilityState={{
                    selected: edge || inBand(day),
                    disabled,
                  }}
                  disabled={disabled}
                  onPress={() => choose(day)}
                  className={cn(
                    'size-9 items-center justify-center rounded-full active:bg-bg-tertiary',
                    inBand(day) && 'active:bg-button-secondary-bg-hover',
                    edge && 'bg-button-primary-bg active:bg-button-primary-bg-active',
                  )}
                >
                  <Text
                    className={cn(
                      'text-sm text-text-primary',
                      isToday && 'font-semibold text-text-brand',
                      edge && 'font-medium text-button-primary-text',
                      disabled && 'text-text-disabled',
                    )}
                  >
                    {day.getDate()}
                  </Text>
                </Pressable>
              </View>
            )
          })}
        </View>
      ))}
    </View>
  )
}
