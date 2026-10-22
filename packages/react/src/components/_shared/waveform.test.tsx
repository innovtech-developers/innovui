import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearWaveformCache,
  computePeaks,
  DEFAULT_WAVEFORM,
  resamplePeaks,
  useWaveform,
} from './waveform'

describe('computePeaks', () => {
  it('silêncio dá barras zeradas', () => {
    expect(computePeaks(new Float32Array(100), 4)).toEqual([0, 0, 0, 0])
  })

  it('pega o pico (em módulo) de cada trecho e normaliza pelo maior', () => {
    const data = new Float32Array([0.1, -0.2, 0.4, 0.1, -0.8, 0.2, 0, 0.05])
    expect(computePeaks(data, 4)).toEqual([0.25, 0.5, 1, 0.0625])
  })

  it('com menos amostras que barras, repete as amostras em vez de quebrar', () => {
    const peaks = computePeaks([0.5, 1], 4)
    expect(peaks).toHaveLength(4)
    expect(Math.max(...peaks)).toBe(1)
  })

  it('sem amostras, devolve zeros', () => {
    expect(computePeaks([], 3)).toEqual([0, 0, 0])
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

describe('useWaveform', () => {
  const fetchMock = vi.fn()
  const decodeAudioData = vi.fn()

  beforeEach(() => {
    clearWaveformCache()
    fetchMock.mockReset()
    decodeAudioData.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal(
      'OfflineAudioContext',
      class {
        decodeAudioData = decodeAudioData
      },
    )
  })
  afterEach(() => vi.unstubAllGlobals())

  const ok = () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) })
  const decoded = (samples: number[]) => ({ getChannelData: () => Float32Array.from(samples) })

  it('com `provided` usa a lista (reamostrada) e não baixa nada', () => {
    const { result } = renderHook(() => useWaveform('/a.mp3', 2, [0.2, 0.4, 0.6, 0.8]))
    expect(result.current).toEqual([0.4, 0.8])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('devolve null enquanto calcula e depois os picos do áudio', async () => {
    fetchMock.mockResolvedValue(ok())
    decodeAudioData.mockResolvedValue(decoded([0.5, -1, 0.25, 0.1]))
    const { result } = renderHook(() => useWaveform('/a.mp3', 2))
    expect(result.current).toBeNull()
    await waitFor(() => expect(result.current).toEqual([1, 0.25]))
    expect(fetchMock).toHaveBeenCalledWith('/a.mp3')
  })

  it('várias instâncias do mesmo áudio baixam uma vez só', async () => {
    fetchMock.mockResolvedValue(ok())
    decodeAudioData.mockResolvedValue(decoded([1, 1]))
    const first = renderHook(() => useWaveform('/a.mp3', 2))
    const second = renderHook(() => useWaveform('/a.mp3', 2))
    await waitFor(() => expect(first.result.current).not.toBeNull())
    await waitFor(() => expect(second.result.current).not.toBeNull())
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('cai na onda padrão se a rede, o CORS ou o formato falharem, e tenta de novo depois', async () => {
    fetchMock.mockRejectedValueOnce(new Error('CORS'))
    const { result, unmount } = renderHook(() => useWaveform('/a.mp3', 52))
    await waitFor(() => expect(result.current).toEqual(DEFAULT_WAVEFORM))
    unmount()

    fetchMock.mockResolvedValue({ ok: false, status: 404 })
    const second = renderHook(() => useWaveform('/a.mp3', 52))
    await waitFor(() => expect(second.result.current).toEqual(DEFAULT_WAVEFORM))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('trocar o src não mostra a onda do áudio anterior', async () => {
    fetchMock.mockResolvedValue(ok())
    decodeAudioData
      .mockResolvedValueOnce(decoded([1, 0.5]))
      .mockResolvedValueOnce(decoded([0.5, 1]))
    const { result, rerender } = renderHook(({ src }) => useWaveform(src, 2), {
      initialProps: { src: '/a.mp3' },
    })
    await waitFor(() => expect(result.current).toEqual([1, 0.5]))
    rerender({ src: '/b.mp3' })
    expect(result.current).toBeNull()
    await waitFor(() => expect(result.current).toEqual([0.5, 1]))
  })
})
