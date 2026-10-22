import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { AccessibilityInfo, Text } from 'react-native'

type Node = { type: unknown; props: { className?: string; style?: { height?: number } } }

import { VideoPlayer, type VideoPlayerProps } from './video-player'

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

const setup = (props: Partial<VideoPlayerProps> = {}) =>
  render(
    <VideoPlayer testID="v" duration={332} {...props}>
      <Text>vídeo</Text>
    </VideoPlayer>,
  )
const settle = (ms: number) => act(() => jest.advanceTimersByTime(ms))

describe('VideoPlayer', () => {
  it('mostra o vídeo (children), o play central e os controles quando pausado', () => {
    setup()
    expect(screen.getByLabelText('Vídeo')).toBeOnTheScreen()
    expect(screen.getByText('vídeo')).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeOnTheScreen()
    expect(screen.getByText('0:00 / 5:32')).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Silenciar' })).toBeOnTheScreen()
  })

  it('o nome do player é configurável', () => {
    setup({ label: 'Vídeo do cliente' })
    expect(screen.getByLabelText('Vídeo do cliente')).toBeOnTheScreen()
  })

  it('o botão da barra e o toque no vídeo avisam onPlayPause', () => {
    const onPlayPause = jest.fn()
    setup({ onPlayPause })
    fireEvent.press(screen.getByRole('button', { name: 'Reproduzir' }))
    expect(onPlayPause).toHaveBeenCalledTimes(1)
    const surface = screen.UNSAFE_root.findAll(
      (node: Node) =>
        typeof node.type === 'string' && String(node.props.className) === 'absolute inset-0',
    )
    fireEvent.press(surface[surface.length - 1] as never)
    expect(onPlayPause.mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('tocando mostra pausar e esconde o play central', () => {
    setup({ playing: true })
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeOnTheScreen()
    expect(screen.queryByRole('button', { name: 'Reproduzir' })).toBeNull()
  })

  it('o progresso vai para o tempo e para o valor de acessibilidade', () => {
    setup({ position: 134 })
    expect(screen.getByText('2:14 / 5:32')).toBeOnTheScreen()
    expect(
      screen.getByRole('adjustable', { name: 'Posição do vídeo' }).props.accessibilityValue,
    ).toEqual({
      min: 0,
      max: 332,
      now: 134,
      text: '2:14 de 5:32',
    })
  })

  it('tocar e arrastar na barra posiciona em segundos', () => {
    const onSeek = jest.fn()
    setup({ onSeek })
    const bar = screen.getByRole('adjustable')
    fireEvent(bar, 'layout', { nativeEvent: { layout: { width: 200, height: 16 } } })
    fireEvent(bar, 'responderGrant', { nativeEvent: { locationX: 50 } })
    expect(onSeek).toHaveBeenLastCalledWith(83)
    fireEvent(bar, 'responderMove', { nativeEvent: { locationX: 999 } })
    expect(onSeek).toHaveBeenLastCalledWith(332)
  })

  it('o leitor de tela ajusta a posição de 5 em 5 segundos', () => {
    const onSeek = jest.fn()
    setup({ position: 10, onSeek })
    fireEvent(screen.getByRole('adjustable'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    })
    expect(onSeek).toHaveBeenLastCalledWith(15)
  })

  it('mudo: o botão troca de nome e avisa onToggleMute', () => {
    const onToggleMute = jest.fn()
    const { rerender } = setup({ onToggleMute })
    fireEvent.press(screen.getByRole('button', { name: 'Silenciar' }))
    expect(onToggleMute).toHaveBeenCalledTimes(1)
    rerender(
      <VideoPlayer muted onToggleMute={onToggleMute}>
        <Text>vídeo</Text>
      </VideoPlayer>,
    )
    expect(screen.getByRole('button', { name: 'Ativar o som' })).toBeOnTheScreen()
  })

  it('tela cheia: só aparece com onToggleFullscreen, e o nome acompanha o estado', () => {
    const onToggleFullscreen = jest.fn()
    const { rerender } = setup()
    expect(screen.queryByRole('button', { name: 'Tela cheia' })).toBeNull()
    rerender(
      <VideoPlayer onToggleFullscreen={onToggleFullscreen}>
        <Text>vídeo</Text>
      </VideoPlayer>,
    )
    fireEvent.press(screen.getByRole('button', { name: 'Tela cheia' }))
    expect(onToggleFullscreen).toHaveBeenCalledTimes(1)
    rerender(
      <VideoPlayer fullscreen onToggleFullscreen={onToggleFullscreen}>
        <Text>vídeo</Text>
      </VideoPlayer>,
    )
    expect(screen.getByRole('button', { name: 'Sair da tela cheia' })).toBeOnTheScreen()
  })

  describe('controles', () => {
    it('somem depois do tempo sem toques enquanto toca, e voltam ao tocar no vídeo', () => {
      setup({ playing: true })
      expect(screen.getByRole('button', { name: 'Pausar' })).toBeOnTheScreen()
      settle(2500)
      expect(screen.queryByRole('button', { name: 'Pausar' })).toBeNull()
      const surface = screen.UNSAFE_root.findAll(
        (node: Node) =>
          typeof node.type === 'string' && String(node.props.className) === 'absolute inset-0',
      )
      fireEvent.press(surface[surface.length - 1] as never)
      expect(screen.getByRole('button', { name: 'Pausar' })).toBeOnTheScreen()
    })

    it('respeita hideControlsAfter', () => {
      setup({ playing: true, hideControlsAfter: 500 })
      settle(499)
      expect(screen.getByRole('button', { name: 'Pausar' })).toBeOnTheScreen()
      settle(1)
      expect(screen.queryByRole('button', { name: 'Pausar' })).toBeNull()
    })

    it('pausado, ficam sempre visíveis', () => {
      setup()
      settle(10_000)
      expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeOnTheScreen()
    })

    it('com leitor de tela ligado, não somem', async () => {
      jest.spyOn(AccessibilityInfo, 'isScreenReaderEnabled').mockResolvedValue(true)
      setup({ playing: true })
      await act(async () => {})
      settle(5000)
      expect(screen.getByRole('button', { name: 'Pausar' })).toBeOnTheScreen()
    })
  })
})
