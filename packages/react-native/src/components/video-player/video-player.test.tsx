import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { AccessibilityInfo, Text } from 'react-native'

type Node = { props: { className?: string; onPress?: unknown } }

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
const surface = () =>
  screen.UNSAFE_root.findAll(
    (node: Node) => Boolean(node.props.onPress) && node.props.className === 'absolute inset-0',
  )[0] as never

describe('VideoPlayer', () => {
  it('mostra o vídeo (children), o play central e os controles quando pausado', () => {
    setup()
    expect(screen.getByLabelText('Vídeo')).toBeOnTheScreen()
    expect(screen.getByText('vídeo')).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeOnTheScreen()
    expect(screen.getByText('0:00 / 5:32')).toBeOnTheScreen()
  })

  it('o nome do player é configurável', () => {
    setup({ label: 'Vídeo do cliente' })
    expect(screen.getByLabelText('Vídeo do cliente')).toBeOnTheScreen()
  })

  it('o botão central avisa onPlayPause; tocar no vídeo não pausa', () => {
    const onPlayPause = jest.fn()
    setup({ onPlayPause, playing: true })
    fireEvent.press(surface())
    expect(onPlayPause).not.toHaveBeenCalled()
    fireEvent.press(surface())
    fireEvent.press(screen.getByRole('button', { name: 'Pausar' }))
    expect(onPlayPause).toHaveBeenCalledTimes(1)
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
      fireEvent.press(surface())
      expect(screen.getByRole('button', { name: 'Pausar' })).toBeOnTheScreen()
    })

    it('tocar no vídeo com os controles à mostra esconde eles', () => {
      setup({ playing: true })
      fireEvent.press(surface())
      expect(screen.queryByRole('button', { name: 'Pausar' })).toBeNull()
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
