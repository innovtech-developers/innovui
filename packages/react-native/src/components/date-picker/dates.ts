/** Funções de data locais (sem fuso): o calendário trabalha com o dia civil, não com instantes. */

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

/** Soma meses mantendo o dia, ou o último dia do mês se ele não existir (31/jan + 1 mês = 28/fev). */
export function addMonths(d: Date, n: number) {
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate()
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last))
}

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export const clamp = (d: Date, min?: Date, max?: Date) => {
  if (min && d < startOfDay(min)) return startOfDay(min)
  if (max && d > startOfDay(max)) return startOfDay(max)
  return d
}

/** `2026-10-19`, o formato de `<input type="date">` e de formulários. */
export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Semanas do mês (linhas de 7 dias, começando em `weekStartsOn`); dias de fora são `null`. */
export function monthWeeks(year: number, month: number, weekStartsOn: number) {
  const lead = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7
  const days = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, i) => new Date(year, month, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7))
}

/** Um período: `to` ausente significa que só o início foi escolhido. */
export type DateRange = { from?: Date; to?: Date }

/**
 * Próximo período depois de um clique em `day`: o primeiro clique define o início; o segundo, o fim
 * (um dia anterior ao início recomeça o período); com o período completo, um novo clique recomeça.
 */
export function pickRange(range: DateRange | undefined, day: Date): DateRange {
  if (range?.from && !range.to && day >= range.from) return { from: range.from, to: day }
  return { from: day }
}
