import { describe, expect, it } from 'vitest'
import { getDatePresets } from './date-presets'
import { toISODate } from './dates'

const iso = (today: Date) =>
  Object.fromEntries(
    getDatePresets(today).map((p) => [p.label, [toISODate(p.range.from), toISODate(p.range.to)]]),
  )

describe('getDatePresets', () => {
  it('lista os cinco atalhos, na ordem', () => {
    expect(getDatePresets(new Date(2026, 9, 19)).map((p) => p.label)).toEqual([
      'Hoje',
      'Últimos 7 dias',
      'Últimos 30 dias',
      'Este mês',
      'Mês passado',
    ])
  })

  it('calcula os períodos a partir de hoje (7 e 30 dias incluem hoje)', () => {
    expect(iso(new Date(2026, 9, 19, 15, 30))).toEqual({
      Hoje: ['2026-10-19', '2026-10-19'],
      'Últimos 7 dias': ['2026-10-13', '2026-10-19'],
      'Últimos 30 dias': ['2026-09-20', '2026-10-19'],
      'Este mês': ['2026-10-01', '2026-10-31'],
      'Mês passado': ['2026-09-01', '2026-09-30'],
    })
  })

  it('em janeiro, o mês passado é dezembro do ano anterior', () => {
    expect(iso(new Date(2026, 0, 15))['Mês passado']).toEqual(['2025-12-01', '2025-12-31'])
  })

  it('atravessa fevereiro e respeita ano bissexto', () => {
    expect(iso(new Date(2026, 2, 5))['Últimos 30 dias']).toEqual(['2026-02-04', '2026-03-05'])
    expect(iso(new Date(2024, 2, 5))['Mês passado']).toEqual(['2024-02-01', '2024-02-29'])
    expect(iso(new Date(2024, 1, 10))['Este mês']).toEqual(['2024-02-01', '2024-02-29'])
  })

  it('sem argumento usa a data de hoje', () => {
    const hoje = getDatePresets()[0]?.range.from
    expect(hoje && toISODate(hoje)).toBe(toISODate(new Date()))
  })
})
