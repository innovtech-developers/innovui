import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { formatTime, togglePlayback, useMediaPlayback, useSeek } from './media'

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

describe('togglePlayback', () => {
  it('toca se está pausado e pausa se está tocando; ignora a recusa do navegador', async () => {
    const audio = document.createElement('audio')
    const play = vi.spyOn(audio, 'play').mockRejectedValue(new Error('NotAllowedError'))
    const pause = vi.spyOn(audio, 'pause').mockImplementation(() => {})
    togglePlayback(audio)
    expect(play).toHaveBeenCalled()
    await Promise.resolve()
    vi.spyOn(audio, 'paused', 'get').mockReturnValue(false)
    togglePlayback(audio)
    expect(pause).toHaveBeenCalled()
    expect(() => togglePlayback(null)).not.toThrow()
  })
})

describe('useMediaPlayback', () => {
  it('espelha os eventos do elemento', () => {
    const audio = document.createElement('audio')
    let time = 0
    Object.defineProperty(audio, 'currentTime', { get: () => time, configurable: true })
    vi.spyOn(audio, 'duration', 'get').mockReturnValue(120)
    const { result } = renderHook(() => useMediaPlayback({ current: audio }))
    expect(result.current).toMatchObject({ playing: false, currentTime: 0, duration: 120 })

    time = 30
    act(() => {
      audio.dispatchEvent(new Event('timeupdate'))
    })
    expect(result.current.currentTime).toBe(30)

    vi.spyOn(audio, 'paused', 'get').mockReturnValue(false)
    act(() => {
      audio.dispatchEvent(new Event('play'))
    })
    expect(result.current.playing).toBe(true)

    audio.muted = true
    act(() => {
      audio.dispatchEvent(new Event('volumechange'))
    })
    expect(result.current.muted).toBe(true)
  })

  it('duração desconhecida (NaN) vale 0 e sem elemento não quebra', () => {
    const { result } = renderHook(() =>
      useMediaPlayback({ current: document.createElement('audio') }),
    )
    expect(result.current.duration).toBe(0)
    expect(() => renderHook(() => useMediaPlayback({ current: null }))).not.toThrow()
  })
})

function Bar({ onSeek, currentTime = 30 }: { onSeek: (t: number) => void; currentTime?: number }) {
  const seek = useSeek({ currentTime, duration: 100, onSeek })
  return (
    // biome-ignore lint/a11y/useAriaPropsForRole: aria-value* vêm do useSeek
    // biome-ignore lint/a11y/useFocusableInteractive: tabIndex vem do useSeek
    <div {...seek} role="slider" aria-label="Posição" data-testid="bar" />
  )
}

describe('useSeek', () => {
  it('expõe os valores de aria do slider', () => {
    render(<Bar onSeek={() => {}} />)
    const bar = screen.getByRole('slider', { name: 'Posição' })
    expect(bar).toHaveAttribute('aria-valuenow', '30')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(bar).toHaveAttribute('aria-valuetext', '0:30 de 1:40')
    expect(bar).toHaveAttribute('tabindex', '0')
  })

  it('o teclado move 5s, e Home/End vão às pontas (sem passar dos limites)', () => {
    const onSeek = vi.fn()
    const { rerender } = render(<Bar onSeek={onSeek} />)
    const bar = screen.getByRole('slider')
    fireEvent.keyDown(bar, { key: 'ArrowRight' })
    expect(onSeek).toHaveBeenLastCalledWith(35)
    fireEvent.keyDown(bar, { key: 'ArrowLeft' })
    expect(onSeek).toHaveBeenLastCalledWith(25)
    fireEvent.keyDown(bar, { key: 'Home' })
    expect(onSeek).toHaveBeenLastCalledWith(0)
    fireEvent.keyDown(bar, { key: 'End' })
    expect(onSeek).toHaveBeenLastCalledWith(100)
    rerender(<Bar onSeek={onSeek} currentTime={98} />)
    fireEvent.keyDown(bar, { key: 'ArrowRight' })
    expect(onSeek).toHaveBeenLastCalledWith(100)
    onSeek.mockClear()
    fireEvent.keyDown(bar, { key: 'a' })
    expect(onSeek).not.toHaveBeenCalled()
  })

  it('clicar e arrastar posiciona pela largura da barra', () => {
    const onSeek = vi.fn()
    render(<Bar onSeek={onSeek} />)
    const bar = screen.getByTestId('bar')
    bar.getBoundingClientRect = () => ({ left: 10, width: 200 }) as DOMRect
    fireEvent.pointerMove(bar, { clientX: 60 })
    expect(onSeek).not.toHaveBeenCalled()
    fireEvent.pointerDown(bar, { pointerId: 1, button: 0, clientX: 110 })
    expect(onSeek).toHaveBeenLastCalledWith(50)
    fireEvent.pointerMove(bar, { clientX: 500 })
    expect(onSeek).toHaveBeenLastCalledWith(100)
    fireEvent.pointerUp(bar)
    onSeek.mockClear()
    fireEvent.pointerMove(bar, { clientX: 60 })
    expect(onSeek).not.toHaveBeenCalled()
    fireEvent.pointerDown(bar, { pointerId: 1, button: 2, clientX: 60 })
    expect(onSeek).not.toHaveBeenCalled()
  })

  it('cancelar o gesto também encerra o arrasto', () => {
    const onSeek = vi.fn()
    render(<Bar onSeek={onSeek} />)
    const bar = screen.getByTestId('bar')
    bar.getBoundingClientRect = () => ({ left: 0, width: 100 }) as DOMRect
    fireEvent.pointerDown(bar, { pointerId: 1, button: 0, clientX: 10 })
    fireEvent.pointerCancel(bar)
    onSeek.mockClear()
    fireEvent.pointerMove(bar, { clientX: 50 })
    expect(onSeek).not.toHaveBeenCalled()
  })
})
