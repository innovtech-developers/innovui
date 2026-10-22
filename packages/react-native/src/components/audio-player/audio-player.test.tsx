import { fireEvent, render, screen } from '@testing-library/react-native'

type Node = { type: unknown; props: { className?: string; style?: { height?: number } } }

import { AudioPlayer } from './audio-player'

const wave = Array.from({ length: 52 }, (_, i) => (i % 2 ? 1 : 0))

const layout = () =>
  fireEvent(screen.getByRole('adjustable'), 'layout', {
    nativeEvent: { layout: { width: 200, height: 34 } },
  })
const at = (locationX: number) => ({ nativeEvent: { locationX } })
const bars = () =>
  screen.UNSAFE_root.findAll(
    (node: Node) =>
      typeof node.type === 'string' && String(node.props.className).includes('min-w-0.5'),
  )
const played = () =>
  bars().filter((bar: Node) => String(bar.props.className).includes('bg-button-primary-bg'))

describe('AudioPlayer', () => {
  it('mostra play, onda, tempo e velocidade na posição inicial (pronta para ouvir)', () => {
    render(<AudioPlayer waveform={wave} duration={372} />)
    expect(screen.getByLabelText('Áudio')).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeOnTheScreen()
    expect(screen.getByText('0:00 / 6:12')).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Velocidade de reprodução: 1x' })).toBeOnTheScreen()
    expect(bars()).toHaveLength(52)
    expect(played()).toHaveLength(0)
  })

  it('o nome do player é configurável', () => {
    render(<AudioPlayer label="Mensagem de voz" />)
    expect(screen.getByLabelText('Mensagem de voz')).toBeOnTheScreen()
  })

  it('tocando mostra pausar, e o botão avisa onPlayPause', () => {
    const onPlayPause = jest.fn()
    const { rerender } = render(<AudioPlayer onPlayPause={onPlayPause} />)
    fireEvent.press(screen.getByRole('button', { name: 'Reproduzir' }))
    expect(onPlayPause).toHaveBeenCalledTimes(1)
    rerender(<AudioPlayer playing onPlayPause={onPlayPause} />)
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeOnTheScreen()
  })

  it('o progresso pinta as barras ouvidas e vai para o valor de acessibilidade', () => {
    render(<AudioPlayer waveform={wave} position={141} duration={372} />)
    expect(screen.getByText('2:21 / 6:12')).toBeOnTheScreen()
    expect(played()).toHaveLength(Math.round((141 / 372) * 52))
    const slider = screen.getByRole('adjustable', { name: 'Posição do áudio' })
    expect(slider.props.accessibilityValue).toEqual({
      min: 0,
      max: 372,
      now: 141,
      text: '2:21 de 6:12',
    })
  })

  it('as barras vêm dos picos: altura de 6 a 34px', () => {
    render(<AudioPlayer waveform={wave} />)
    const heights = bars().map((bar: Node) => bar.props.style?.height)
    expect(heights[0]).toBe(6)
    expect(heights[1]).toBe(34)
  })

  it('sem waveform usa a onda padrão do Figma, e bars muda a quantidade', () => {
    render(<AudioPlayer bars={30} />)
    expect(bars()).toHaveLength(30)
  })

  it('em espaço estreito desenha só as barras que cabem, sem perder o progresso', () => {
    render(<AudioPlayer waveform={wave} position={50} duration={100} />)
    fireEvent(screen.getByRole('adjustable'), 'layout', {
      nativeEvent: { layout: { width: 100, height: 34 } },
    })
    expect(bars()).toHaveLength(25) // 4px por barra (2px + 2px de espaço)
    expect(played()).toHaveLength(13) // metade das barras desenhadas
    fireEvent(screen.getByRole('adjustable'), 'layout', {
      nativeEvent: { layout: { width: 1000, height: 34 } },
    })
    expect(bars()).toHaveLength(52) // nunca passa de `bars`
  })

  it('tocar e arrastar na onda posiciona em segundos', () => {
    const onSeek = jest.fn()
    render(<AudioPlayer duration={200} onSeek={onSeek} />)
    layout()
    const slider = screen.getByRole('adjustable')
    fireEvent(slider, 'responderGrant', at(100))
    expect(onSeek).toHaveBeenLastCalledWith(100)
    fireEvent(slider, 'responderMove', at(400))
    expect(onSeek).toHaveBeenLastCalledWith(200)
    fireEvent(slider, 'responderMove', at(-50))
    expect(onSeek).toHaveBeenLastCalledWith(0)
  })

  it('sem duração, tocar na onda não faz nada', () => {
    const onSeek = jest.fn()
    render(<AudioPlayer onSeek={onSeek} />)
    layout()
    expect(screen.getByRole('adjustable').props.onStartShouldSetResponder()).toBe(false)
  })

  it('o leitor de tela ajusta de 5 em 5 segundos, sem passar dos limites', () => {
    const onSeek = jest.fn()
    render(<AudioPlayer position={98} duration={100} onSeek={onSeek} />)
    const slider = screen.getByRole('adjustable')
    fireEvent(slider, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } })
    expect(onSeek).toHaveBeenLastCalledWith(100)
    fireEvent(slider, 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } })
    expect(onSeek).toHaveBeenLastCalledWith(93)
  })

  it('a velocidade percorre 1x, 1.5x, 2x e volta, avisando onRateChange', () => {
    const onRateChange = jest.fn()
    render(<AudioPlayer onRateChange={onRateChange} />)
    const button = () => screen.getByRole('button', { name: /Velocidade de reprodução/ })
    fireEvent.press(button())
    expect(button()).toHaveTextContent('1.5x')
    expect(onRateChange).toHaveBeenLastCalledWith(1.5)
    fireEvent.press(button())
    expect(button()).toHaveTextContent('2x')
    fireEvent.press(button())
    expect(button()).toHaveTextContent('1x')
    expect(onRateChange).toHaveBeenLastCalledWith(1)
  })

  it('com `rate` controlado, a velocidade mostrada é a do pai', () => {
    const { rerender } = render(<AudioPlayer rate={2} />)
    expect(screen.getByRole('button', { name: /Velocidade/ })).toHaveTextContent('2x')
    rerender(<AudioPlayer rate={1.5} />)
    expect(screen.getByRole('button', { name: /Velocidade/ })).toHaveTextContent('1.5x')
  })

  it('aceita velocidades próprias', () => {
    render(<AudioPlayer speeds={[0.5, 1]} />)
    expect(screen.getByRole('button', { name: /Velocidade/ })).toHaveTextContent('0.5x')
    fireEvent.press(screen.getByRole('button', { name: /Velocidade/ }))
    expect(screen.getByRole('button', { name: /Velocidade/ })).toHaveTextContent('1x')
  })
})
