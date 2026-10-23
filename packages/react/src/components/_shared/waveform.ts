'use client'

import { useEffect, useState } from 'react'

/** Alturas das barras do Figma (6–34px), como picos de 0 a 1. É a onda padrão e o fallback. */
export const DEFAULT_WAVEFORM = [
  6, 18, 34, 20, 12, 22, 16, 26, 20, 14, 28, 18, 34, 22, 16, 24, 20, 14, 18, 26, 16, 30, 22, 12, 34,
  18, 26, 16, 10, 22, 14, 20, 24, 16, 28, 12, 34, 18, 26, 16, 10, 20, 14, 18, 24, 30, 22, 28, 34,
  16, 24, 18,
].map((height) => (height - 6) / 28)

/**
 * Volume (RMS) de cada um dos `bars` trechos, de 0 a 1. O RMS acompanha o volume que se ouve; o
 * maior valor do trecho (o pico) fica quase sempre alto, mesmo no ruído, e deixa toda onda igual.
 * Normaliza pela segunda ou terceira barra mais alta, não pela maior: um estouro (tosse, batida)
 * não achata o resto, e as poucas barras acima disso ficam no topo.
 */
export function computePeaks(data: ArrayLike<number>, bars: number) {
  const levels = Array.from({ length: bars }, (_, i) => {
    const start = Math.floor((i * data.length) / bars)
    const end = Math.max(Math.floor(((i + 1) * data.length) / bars), start + 1)
    let sum = 0
    let count = 0
    for (let j = start; j < end && j < data.length; j++) {
      sum += (data[j] as number) ** 2
      count++
    }
    return count ? Math.sqrt(sum / count) : 0
  })
  const reference = [...levels].sort((a, b) => a - b)[Math.ceil(bars * 0.95) - 1] ?? 0
  return reference > 0 ? levels.map((level) => Math.min(level / reference, 1)) : levels
}

/** Leva uma lista de picos para `bars` barras (pega o maior de cada trecho, ou repete se faltar). */
export function resamplePeaks(peaks: number[], bars: number) {
  if (peaks.length === bars || peaks.length === 0) return peaks
  return Array.from({ length: bars }, (_, i) => {
    const start = Math.floor((i * peaks.length) / bars)
    const end = Math.max(Math.floor(((i + 1) * peaks.length) / bars), start + 1)
    return Math.max(...peaks.slice(start, end))
  })
}

// ponytail: decodifica o arquivo inteiro na memória (a 8 kHz, ~1 MB por minuto). Serve para áudios
// de alguns minutos; para os longos, passe `waveform` já calculado no servidor.
async function decodePeaks(src: string, bars: number) {
  const response = await fetch(src)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  // 8 kHz: o `decodeAudioData` reamostra para a taxa do contexto, e a onda não precisa de mais
  const context = new OfflineAudioContext(1, 1, 8000)
  const audio = await context.decodeAudioData(await response.arrayBuffer())
  return computePeaks(audio.getChannelData(0), bars)
}

const cache = new Map<string, Promise<number[]>>()

function loadPeaks(src: string, bars: number) {
  const key = `${src}\n${bars}`
  let peaks = cache.get(key)
  if (!peaks) {
    peaks = decodePeaks(src, bars)
    cache.set(key, peaks)
    // uma falha (rede, CORS) não fica guardada: a próxima tentativa refaz
    peaks.catch(() => cache.delete(key))
  }
  return peaks
}

/**
 * Picos (0 a 1) de `bars` barras para desenhar a onda de `src`. Devolve `null` enquanto calcula e
 * a onda padrão se falhar (CORS, formato, rede). Com `provided`, usa essa lista e não baixa nada.
 */
export function useWaveform(src: string, bars: number, provided?: number[]) {
  const key = `${src}\n${bars}`
  const [loaded, setLoaded] = useState<{ key: string; peaks: number[] } | null>(null)

  useEffect(() => {
    if (provided) return
    let cancelled = false
    loadPeaks(src, bars).then(
      (peaks) => !cancelled && setLoaded({ key, peaks }),
      () => !cancelled && setLoaded({ key, peaks: resamplePeaks(DEFAULT_WAVEFORM, bars) }),
    )
    return () => {
      cancelled = true
    }
  }, [src, bars, key, provided])

  if (provided) return resamplePeaks(provided, bars)
  return loaded?.key === key ? loaded.peaks : null
}

/** Só para os testes: esvazia o cache de picos. */
export function clearWaveformCache() {
  cache.clear()
}
