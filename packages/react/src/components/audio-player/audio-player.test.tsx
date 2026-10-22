import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearWaveformCache, DEFAULT_WAVEFORM } from '../_shared/waveform'
import { AudioPlayer } from './audio-player'

const DURATION = 372 // 6:12, como no Figma
const wave = Array.from({ length: 52 }, (_, i) => (i % 2 ? 1 : 0))

let paused: boolean

beforeEach(() => {
  paused = true
  vi.spyOn(HTMLMediaElement.prototype, 'paused', 'get').mockImplementation(() => paused)
  vi.spyOn(HTMLMediaElement.prototype, 'duration', 'get').mockReturnValue(DURATION)
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    paused = false
    this.dispatchEvent(new Event('play'))
    return Promise.resolve()
  })
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    paused = true
    this.dispatchEvent(new Event('pause'))
  })
})
afterEach(() => vi.restoreAllMocks())

function setup(props: Partial<React.ComponentProps<typeof AudioPlayer>> = {}) {
  const view = render(<AudioPlayer src="/audio.mp3" waveform={wave} {...props} />)
  const audio = view.container.querySelector('audio') as HTMLAudioElement
  let time = 0
  Object.defineProperty(audio, 'currentTime', {
    configurable: true,
    get: () => time,
    set: (value: number) => {
      time = value
    },
  })
  const tick = (seconds: number) => {
    time = seconds
    act(() => {
      audio.dispatchEvent(new Event('timeupdate'))
    })
  }
  return { ...view, audio, tick, getTime: () => time }
}

const slider = () => screen.getByRole('slider', { name: 'Posição do áudio' })
const playedBars = () =>
  [...slider().children].filter((bar) =>
    bar.className.includes('bg-[var(--color-button-primary-bg)]'),
  )

describe('AudioPlayer', () => {
  it('mostra play, onda, tempo e velocidade na posição inicial (pronta para ouvir)', () => {
    setup()
    expect(screen.getByRole('group', { name: 'Áudio' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeInTheDocument()
    expect(screen.getByText('0:00 / 6:12')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Velocidade de reprodução: 1x' })).toHaveTextContent(
      '1x',
    )
    expect(slider().children).toHaveLength(52)
    expect(playedBars()).toHaveLength(0)
  })

  it('as barras vêm dos picos: altura de 6 a 34px', () => {
    setup()
    const heights = [...slider().children].map((bar) => (bar as HTMLElement).style.height)
    expect(heights[0]).toBe('6px')
    expect(heights[1]).toBe('34px')
  })

  it('o ícone de play/pause é branco nos dois temas, como no Figma (não usa o texto do botão)', () => {
    setup()
    const button = screen.getByRole('button', { name: 'Reproduzir' })
    expect(button).toHaveClass('iu:text-[var(--color-media-on-surface)]')
    expect(button.className).not.toContain('button-primary-text')
  })

  it('o nome do grupo é configurável', () => {
    setup({ label: 'Mensagem de voz' })
    expect(screen.getByRole('group', { name: 'Mensagem de voz' })).toBeInTheDocument()
  })

  it('play toca e vira pausa; pausa volta a play', async () => {
    const onPlay = vi.fn()
    const onPause = vi.fn()
    setup({ onPlay, onPause })
    await userEvent.click(screen.getByRole('button', { name: 'Reproduzir' }))
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
    expect(onPlay).toHaveBeenCalled()
    await userEvent.click(await screen.findByRole('button', { name: 'Pausar' }))
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
    expect(onPause).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeInTheDocument()
  })

  it('acompanha o progresso: tempo, barras ouvidas e valor do slider', () => {
    const onTimeUpdate = vi.fn()
    const { tick } = setup({ onTimeUpdate })
    tick(141) // 2:21 de 6:12, o estado "em reprodução" do Figma
    expect(screen.getByText('2:21 / 6:12')).toBeInTheDocument()
    expect(playedBars()).toHaveLength(Math.round((141 / DURATION) * 52))
    expect(slider()).toHaveAttribute('aria-valuenow', '141')
    expect(slider()).toHaveAttribute('aria-valuetext', '2:21 de 6:12')
    expect(onTimeUpdate).toHaveBeenCalled()
  })

  it('clicar na onda posiciona o áudio', () => {
    const { getTime } = setup()
    slider().getBoundingClientRect = () => ({ left: 0, width: 200 }) as DOMRect
    fireEvent.pointerDown(slider(), { pointerId: 1, button: 0, clientX: 100 })
    expect(getTime()).toBe(DURATION / 2)
  })

  it('o teclado na onda avança e volta 5s', async () => {
    const { getTime } = setup()
    slider().focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    expect(getTime()).toBe(5) // o 2º passo parte do tempo ainda não atualizado pelo evento
    await userEvent.keyboard('{End}')
    expect(getTime()).toBe(DURATION)
    await userEvent.keyboard('{Home}')
    expect(getTime()).toBe(0)
  })

  it('ao terminar, volta ao começo (finalizada, progresso zerado)', () => {
    const onEnded = vi.fn()
    const { audio, tick, getTime } = setup({ onEnded })
    tick(DURATION)
    act(() => {
      audio.dispatchEvent(new Event('ended'))
    })
    expect(getTime()).toBe(0)
    expect(onEnded).toHaveBeenCalled()
    expect(screen.getByText('0:00 / 6:12')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeInTheDocument()
  })

  it('a velocidade percorre 1x, 1.5x, 2x e volta, aplicando no áudio', async () => {
    const { audio } = setup()
    const button = () => screen.getByRole('button', { name: /Velocidade de reprodução/ })
    await userEvent.click(button())
    expect(button()).toHaveTextContent('1.5x')
    expect(audio.playbackRate).toBe(1.5)
    await userEvent.click(button())
    expect(button()).toHaveTextContent('2x')
    expect(audio.playbackRate).toBe(2)
    await userEvent.click(button())
    expect(button()).toHaveTextContent('1x')
    expect(audio.playbackRate).toBe(1)
  })

  it('aceita velocidades próprias', async () => {
    setup({ speeds: [0.5, 1] })
    expect(screen.getByRole('button', { name: /Velocidade/ })).toHaveTextContent('0.5x')
    await userEvent.click(screen.getByRole('button', { name: /Velocidade/ }))
    expect(screen.getByRole('button', { name: /Velocidade/ })).toHaveTextContent('1x')
  })

  it('aceita outra quantidade de barras', () => {
    setup({ bars: 30 })
    expect(slider().children).toHaveLength(30)
  })

  it('repassa className e props do contêiner', () => {
    setup({ className: 'minha-classe', 'data-testid': 'player' } as never)
    expect(screen.getByTestId('player')).toHaveClass('minha-classe')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = setup()
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('AudioPlayer: onda automática', () => {
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

  const heights = () => [...slider().children].map((bar) => (bar as HTMLElement).style.height)

  it('enquanto analisa, as barras ficam baixas e o slider marca ocupado; depois mostra a onda', async () => {
    fetchMock.mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) })
    decodeAudioData.mockResolvedValue({
      getChannelData: () => Float32Array.from({ length: 520 }, (_, i) => (i < 260 ? 0.1 : 1)),
    })
    render(<AudioPlayer src="/a.mp3" />)
    expect(slider()).toHaveAttribute('aria-busy', 'true')
    expect(new Set(heights())).toEqual(new Set(['6px']))
    await waitFor(() => expect(slider()).not.toHaveAttribute('aria-busy'))
    // 1ª metade fraca (0.1 do pico), 2ª no pico: 6 + 0.1 × 28 e 6 + 1 × 28
    expect(Number.parseFloat(heights()[0] as string)).toBeCloseTo(8.8, 1)
    expect(heights()[51]).toBe('34px')
  })

  it('se não conseguir analisar (CORS, formato), usa a onda padrão e o áudio segue tocável', async () => {
    fetchMock.mockRejectedValue(new Error('CORS'))
    render(<AudioPlayer src="/b.mp3" />)
    await waitFor(() => expect(slider()).not.toHaveAttribute('aria-busy'))
    expect(heights()).toEqual(DEFAULT_WAVEFORM.map((peak) => `${6 + peak * 28}px`))
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeEnabled()
  })

  it('com `waveform` não baixa nada', () => {
    render(<AudioPlayer src="/c.mp3" waveform={wave} />)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(slider()).not.toHaveAttribute('aria-busy')
  })
})
