import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { VideoPlayer } from './video-player'

const DURATION = 332 // 5:32, como no Figma

let paused: boolean

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

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
afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  Reflect.deleteProperty(document, 'fullscreenEnabled')
  Reflect.deleteProperty(document, 'fullscreenElement')
  Reflect.deleteProperty(document, 'exitFullscreen')
  Reflect.deleteProperty(HTMLElement.prototype, 'requestFullscreen')
  Reflect.deleteProperty(HTMLVideoElement.prototype, 'webkitEnterFullscreen')
})

function setup(props: Partial<React.ComponentProps<typeof VideoPlayer>> = {}) {
  const view = render(<VideoPlayer src="/video.mp4" {...props} />)
  const video = view.container.querySelector('video') as HTMLVideoElement
  let time = 0
  Object.defineProperty(video, 'currentTime', {
    configurable: true,
    get: () => time,
    set: (value: number) => {
      time = value
    },
  })
  const tick = (seconds: number) => {
    time = seconds
    act(() => {
      video.dispatchEvent(new Event('timeupdate'))
    })
  }
  return {
    ...view,
    video,
    tick,
    getTime: () => time,
    root: view.container.firstElementChild as HTMLElement,
  }
}

const bar = () => screen.getByRole('slider', { name: 'Posição do vídeo' })
const centerPlay = (container: HTMLElement) =>
  container.querySelector('button[aria-hidden="true"]') as HTMLButtonElement | null
const controlsOf = (container: HTMLElement) =>
  container.querySelector('[inert], .iu\\:bottom-0') as HTMLElement

describe('VideoPlayer', () => {
  it('começa pausado: play central, controles e tempo zerado', () => {
    const { container } = setup()
    expect(screen.getByRole('group', { name: 'Vídeo' })).toBeInTheDocument()
    expect(centerPlay(container)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeInTheDocument()
    expect(screen.getByText('0:00 / 5:32')).toBeInTheDocument()
    expect(bar()).toHaveAttribute('aria-valuemax', String(DURATION))
  })

  it('repassa poster, loop, muted, preload e as legendas (children) ao <video>', () => {
    const { video } = setup({
      poster: '/capa.jpg',
      loop: true,
      muted: true,
      preload: 'none',
      children: <track kind="captions" src="/pt.vtt" srcLang="pt" label="Português" />,
    })
    expect(video).toHaveAttribute('poster', '/capa.jpg')
    expect(video.loop).toBe(true)
    expect(video.muted).toBe(true)
    expect(video).toHaveAttribute('preload', 'none')
    expect(video.querySelector('track')).toHaveAttribute('src', '/pt.vtt')
  })

  it('o nome do grupo é configurável', () => {
    setup({ label: 'Vídeo do cliente' })
    expect(screen.getByRole('group', { name: 'Vídeo do cliente' })).toBeInTheDocument()
  })

  it('toca pelo botão da barra, pelo play central e pelo clique no vídeo', async () => {
    const onPlay = vi.fn()
    const onPause = vi.fn()
    const { container, video } = setup({ onPlay, onPause })
    await userEvent.click(screen.getByRole('button', { name: 'Reproduzir' }))
    expect(onPlay).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument()
    expect(centerPlay(container)).not.toBeInTheDocument()

    await userEvent.click(video)
    expect(onPause).toHaveBeenCalledTimes(1)
    expect(centerPlay(container)).toBeInTheDocument()

    await userEvent.click(centerPlay(container) as HTMLElement)
    expect(onPlay).toHaveBeenCalledTimes(2)
  })

  it('acompanha o progresso: tempo, valor do slider e barra preenchida', () => {
    const onTimeUpdate = vi.fn()
    const { tick } = setup({ onTimeUpdate })
    tick(134) // 2:14 de 5:32, como nos estados do Figma
    expect(screen.getByText('2:14 / 5:32')).toBeInTheDocument()
    expect(bar()).toHaveAttribute('aria-valuenow', '134')
    expect(bar()).toHaveAttribute('aria-valuetext', '2:14 de 5:32')
    const fill = bar().querySelector('[style*="width"]') as HTMLElement
    expect(fill.style.width).toBe(`${(134 / DURATION) * 100}%`)
    expect(onTimeUpdate).toHaveBeenCalled()
  })

  it('clicar na barra e usar o teclado posicionam o vídeo', async () => {
    const { getTime } = setup()
    bar().getBoundingClientRect = () => ({ left: 0, width: 200 }) as DOMRect
    fireEvent.pointerDown(bar(), { pointerId: 1, button: 0, clientX: 50 })
    expect(getTime()).toBe(DURATION / 4)
    bar().focus()
    await userEvent.keyboard('{Home}')
    expect(getTime()).toBe(0)
  })

  it('terminou: o botão volta a ser Reproduzir', () => {
    const onEnded = vi.fn()
    const { video } = setup({ onEnded })
    act(() => {
      video.dispatchEvent(new Event('ended'))
    })
    expect(onEnded).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeInTheDocument()
  })

  describe('volume', () => {
    it('silenciar e ativar o som', async () => {
      const { video } = setup()
      await userEvent.click(screen.getByRole('button', { name: 'Silenciar' }))
      expect(video.muted).toBe(true)
      await userEvent.click(screen.getByRole('button', { name: 'Ativar o som' }))
      expect(video.muted).toBe(false)
    })

    it('ativar o som com volume zerado volta ao máximo', async () => {
      const { video } = setup()
      video.volume = 0
      act(() => {
        video.dispatchEvent(new Event('volumechange'))
      })
      await userEvent.click(screen.getByRole('button', { name: 'Ativar o som' }))
      expect(video.volume).toBe(1)
      expect(video.muted).toBe(false)
    })

    it('o slider muda o volume e zerar silencia', async () => {
      const { video } = setup()
      const slider = screen.getByRole('slider', { name: 'Volume' })
      expect(slider).toHaveAttribute('aria-valuenow', '100')
      slider.focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(video.volume).toBeCloseTo(0.99)
      await userEvent.keyboard('{Home}')
      expect(video.volume).toBe(0)
      expect(video.muted).toBe(true)
      expect(screen.getByRole('button', { name: 'Ativar o som' })).toBeInTheDocument()
    })

    it('sem como ajustar o volume por script (iPhone), não mostra o slider mas mantém o mudo', () => {
      vi.spyOn(HTMLMediaElement.prototype, 'volume', 'get').mockReturnValue(1)
      vi.spyOn(HTMLMediaElement.prototype, 'volume', 'set').mockImplementation(() => {})
      setup()
      expect(screen.queryByRole('slider', { name: 'Volume' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Silenciar' })).toBeInTheDocument()
    })
  })

  describe('controles', () => {
    it('a faixa dos controles deixa o toque passar: o play central fica clicável em telas pequenas', () => {
      const { container } = setup()
      const controls = controlsOf(container)
      expect(controls).toHaveClass('iu:pointer-events-none')
      // só a barra e a fileira de botões recebem o toque
      for (const part of controls.children) expect(part).toHaveClass('iu:pointer-events-auto')
    })

    it('somem depois do tempo sem interação enquanto toca, e voltam ao mexer o mouse', () => {
      vi.useFakeTimers()
      const { container, root } = setup()
      fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }))
      const controls = controlsOf(container)
      expect(controls).not.toHaveAttribute('inert')

      act(() => {
        vi.advanceTimersByTime(2500)
      })
      expect(controls).toHaveAttribute('inert')
      expect(root).toHaveClass('iu:cursor-none')

      fireEvent.pointerMove(root)
      expect(controls).not.toHaveAttribute('inert')
      expect(root).not.toHaveClass('iu:cursor-none')
    })

    it('respeita hideControlsAfter', () => {
      vi.useFakeTimers()
      const { container } = setup({ hideControlsAfter: 500 })
      fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }))
      act(() => {
        vi.advanceTimersByTime(499)
      })
      expect(controlsOf(container)).not.toHaveAttribute('inert')
      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(controlsOf(container)).toHaveAttribute('inert')
    })

    it('pausado, ficam sempre visíveis', () => {
      vi.useFakeTimers()
      const { container } = setup()
      act(() => {
        vi.advanceTimersByTime(10_000)
      })
      expect(controlsOf(container)).not.toHaveAttribute('inert')
    })

    it('com o foco do teclado nos controles, não somem', () => {
      vi.useFakeTimers()
      // o jsdom não calcula :focus-visible: aqui o foco programático faz as vezes do teclado
      const matches = Element.prototype.matches
      vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector) {
        return selector === ':has(:focus-visible)'
          ? this.contains(document.activeElement)
          : matches.call(this, selector)
      })
      const { container } = setup()
      fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }))
      screen.getByRole('button', { name: 'Silenciar' }).focus()
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      expect(controlsOf(container)).not.toHaveAttribute('inert')
    })

    it('o foco deixado por um clique de mouse não segura os controles', () => {
      vi.useFakeTimers()
      const { container } = setup()
      fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }))
      screen.getByRole('button', { name: 'Pausar' }).focus()
      act(() => {
        vi.advanceTimersByTime(2500)
      })
      expect(controlsOf(container)).toHaveAttribute('inert')
    })
  })

  describe('tela cheia', () => {
    it('sem suporte do navegador, não mostra o botão', () => {
      setup()
      expect(screen.queryByRole('button', { name: 'Tela cheia' })).not.toBeInTheDocument()
    })

    it('entra no contêiner (não no <video>), troca o ícone e sai', async () => {
      Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: true })
      const requestFullscreen = vi.fn()
      HTMLElement.prototype.requestFullscreen = requestFullscreen
      const exitFullscreen = vi.fn()
      Object.defineProperty(document, 'exitFullscreen', {
        configurable: true,
        value: exitFullscreen,
      })
      const { root } = setup()

      await userEvent.click(screen.getByRole('button', { name: 'Tela cheia' }))
      expect(requestFullscreen).toHaveBeenCalled()

      Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: root })
      act(() => {
        document.dispatchEvent(new Event('fullscreenchange'))
      })
      await userEvent.click(screen.getByRole('button', { name: 'Sair da tela cheia' }))
      expect(exitFullscreen).toHaveBeenCalled()
    })

    it('no iPhone, abre o player nativo do <video>', async () => {
      const webkitEnterFullscreen = vi.fn()
      Object.assign(HTMLVideoElement.prototype, { webkitEnterFullscreen })
      setup()
      await userEvent.click(screen.getByRole('button', { name: 'Tela cheia' }))
      expect(webkitEnterFullscreen).toHaveBeenCalled()
    })
  })

  it('repassa className e props do contêiner', () => {
    const { root } = setup({ className: 'minha-classe' })
    expect(root).toHaveClass('minha-classe')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = setup()
    expect(await axe(container)).toHaveNoViolations()
  })
})
