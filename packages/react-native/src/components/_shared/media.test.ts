import { DEFAULT_WAVEFORM, formatTime, resamplePeaks } from './media'

describe('formatTime', () => {
  it.each([
    [0, '0:00'],
    [5, '0:05'],
    [83, '1:23'],
    [372.9, '6:12'],
    [3725, '1:02:05'],
    [Number.NaN, '0:00'],
    [Number.POSITIVE_INFINITY, '0:00'],
    [-4, '0:00'],
  ])('%s vira %s', (seconds, text) => {
    expect(formatTime(seconds)).toBe(text)
  })
})

describe('resamplePeaks', () => {
  it('não mexe quando já tem o tamanho certo (ou está vazio)', () => {
    const peaks = [0.1, 0.9]
    expect(resamplePeaks(peaks, 2)).toBe(peaks)
    expect(resamplePeaks([], 5)).toEqual([])
  })

  it('reduz pegando o maior de cada trecho', () => {
    expect(resamplePeaks([0.1, 0.9, 0.3, 0.2], 2)).toEqual([0.9, 0.3])
  })

  it('amplia repetindo os valores', () => {
    expect(resamplePeaks([0.2, 0.8], 4)).toEqual([0.2, 0.2, 0.8, 0.8])
  })
})

describe('DEFAULT_WAVEFORM', () => {
  it('tem as 52 barras do Figma, entre 0 e 1', () => {
    expect(DEFAULT_WAVEFORM).toHaveLength(52)
    expect(Math.min(...DEFAULT_WAVEFORM)).toBeGreaterThanOrEqual(0)
    expect(Math.max(...DEFAULT_WAVEFORM)).toBe(1)
  })
})
