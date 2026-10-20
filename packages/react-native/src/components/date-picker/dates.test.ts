import {
  addDays,
  addMonths,
  clamp,
  isSameDay,
  monthWeeks,
  pickRange,
  startOfDay,
  toISODate,
} from './dates'

describe('dates', () => {
  it('addDays atravessa mês e ano', () => {
    expect(toISODate(addDays(new Date(2026, 0, 31), 1))).toBe('2026-02-01')
    expect(toISODate(addDays(new Date(2026, 0, 1), -1))).toBe('2025-12-31')
  })

  it('addMonths mantém o dia, ou usa o último dia do mês', () => {
    expect(toISODate(addMonths(new Date(2026, 0, 31), 1))).toBe('2026-02-28')
    expect(toISODate(addMonths(new Date(2024, 0, 31), 1))).toBe('2024-02-29')
    expect(toISODate(addMonths(new Date(2026, 10, 15), 2))).toBe('2027-01-15')
    expect(toISODate(addMonths(new Date(2026, 0, 15), -1))).toBe('2025-12-15')
  })

  it('clamp limita ao intervalo e ignora a hora', () => {
    const min = new Date(2026, 5, 10, 15)
    const max = new Date(2026, 5, 20, 9)
    expect(toISODate(clamp(new Date(2026, 5, 1), min, max))).toBe('2026-06-10')
    expect(toISODate(clamp(new Date(2026, 5, 30), min, max))).toBe('2026-06-20')
    expect(toISODate(clamp(new Date(2026, 5, 15), min, max))).toBe('2026-06-15')
    expect(toISODate(clamp(new Date(2026, 5, 15)))).toBe('2026-06-15')
  })

  it('isSameDay e startOfDay comparam o dia civil', () => {
    expect(isSameDay(new Date(2026, 5, 1, 8), new Date(2026, 5, 1, 23))).toBe(true)
    expect(isSameDay(new Date(2026, 5, 1), new Date(2026, 5, 2))).toBe(false)
    expect(startOfDay(new Date(2026, 5, 1, 13, 30)).getHours()).toBe(0)
  })

  it('toISODate completa com zeros', () => {
    expect(toISODate(new Date(2026, 2, 5))).toBe('2026-03-05')
  })

  it('monthWeeks completa as semanas com null (semana começando no domingo)', () => {
    // outubro/2026 começa numa quinta e tem 31 dias
    const weeks = monthWeeks(2026, 9, 0)
    expect(weeks).toHaveLength(5)
    expect(weeks[0]?.slice(0, 4)).toEqual([null, null, null, null])
    expect(weeks[0]?.[4]?.getDate()).toBe(1)
    expect(weeks[4]?.[6]?.getDate()).toBe(31)
    expect(weeks.flat().filter(Boolean)).toHaveLength(31)
  })

  it('monthWeeks respeita weekStartsOn', () => {
    const weeks = monthWeeks(2026, 9, 1) // semana começa na segunda
    expect(weeks[0]?.slice(0, 3)).toEqual([null, null, null])
    expect(weeks[0]?.[3]?.getDate()).toBe(1)
  })

  it('um mês que cabe em 4 semanas (fev/2026 começa no domingo)', () => {
    expect(monthWeeks(2026, 1, 0)).toHaveLength(4)
  })

  describe('pickRange', () => {
    const d = (n: number) => new Date(2026, 9, n)

    it('o primeiro clique define só o início', () => {
      expect(pickRange(undefined, d(10))).toEqual({ from: d(10) })
      expect(pickRange({}, d(10))).toEqual({ from: d(10) })
    })

    it('o segundo clique, depois do início, define o fim', () => {
      expect(pickRange({ from: d(10) }, d(15))).toEqual({ from: d(10), to: d(15) })
    })

    it('o segundo clique no mesmo dia faz um período de um dia', () => {
      expect(pickRange({ from: d(10) }, d(10))).toEqual({ from: d(10), to: d(10) })
    })

    it('um clique antes do início recomeça o período', () => {
      expect(pickRange({ from: d(10) }, d(5))).toEqual({ from: d(5) })
    })

    it('com o período completo, um novo clique recomeça', () => {
      expect(pickRange({ from: d(10), to: d(15) }, d(20))).toEqual({ from: d(20) })
      expect(pickRange({ from: d(10), to: d(15) }, d(12))).toEqual({ from: d(12) })
    })
  })
})
