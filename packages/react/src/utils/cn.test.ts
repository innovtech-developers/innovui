import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('concatena classes estáticas', () => {
    expect(cn('iu:text-sm', 'iu:font-bold')).toBe('iu:text-sm iu:font-bold')
  })

  it('ignora valores falsy', () => {
    expect(cn('iu:text-sm', false, undefined, null, '')).toBe('iu:text-sm')
  })

  it('resolve conflito mantendo a última classe prefixada', () => {
    expect(cn('iu:p-2', 'iu:p-4')).toBe('iu:p-4')
  })

  it('aplica condicionais de objeto', () => {
    expect(cn('iu:font-bold', { 'iu:italic': true, 'iu:text-red-500': false })).toBe(
      'iu:font-bold iu:italic',
    )
  })

  it('resolve conflito de display mantendo a última classe', () => {
    expect(cn('iu:block', { 'iu:hidden': true })).toBe('iu:hidden')
  })
})
