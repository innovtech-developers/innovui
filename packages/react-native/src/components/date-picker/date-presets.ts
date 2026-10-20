import type { DateRange } from './dates'
import { addDays, startOfDay } from './dates'

export type DatePreset = {
  /** Texto do atalho. */
  label: string
  /** Período que o atalho escolhe, com início e fim. */
  range: Required<DateRange>
}

/**
 * Atalhos comuns de período, contados a partir de `today`: hoje, últimos 7 e 30 dias (incluindo
 * hoje), este mês e mês passado. Passe só os que quiser, ou monte os seus, em `presets`.
 */
export function getDatePresets(today: Date = new Date()): DatePreset[] {
  const day = startOfDay(today)
  const year = day.getFullYear()
  const month = day.getMonth()
  return [
    { label: 'Hoje', range: { from: day, to: day } },
    { label: 'Últimos 7 dias', range: { from: addDays(day, -6), to: day } },
    { label: 'Últimos 30 dias', range: { from: addDays(day, -29), to: day } },
    {
      label: 'Este mês',
      range: { from: new Date(year, month, 1), to: new Date(year, month + 1, 0) },
    },
    {
      label: 'Mês passado',
      range: { from: new Date(year, month - 1, 1), to: new Date(year, month, 0) },
    },
  ]
}
