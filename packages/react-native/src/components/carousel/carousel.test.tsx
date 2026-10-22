import { fireEvent, render, screen } from '@testing-library/react-native'
import { ScrollView, Text } from 'react-native'
import { Carousel, CarouselItem } from './carousel'

// Carrossel de 300px com 3 itens: item = 78% (234px) + 16px de espaço → encaixes em 0, 250 e 434
// (o último é o fim da rolagem: 3 × 250 − 16 − 300).
function setup(props: Partial<Parameters<typeof Carousel>[0]> = {}) {
  render(
    <Carousel label="Modelos" testID="c" {...props}>
      {['Boas-vindas', 'Catálogo', 'Pedido'].map((name) => (
        <CarouselItem key={name}>
          <Text>{name}</Text>
        </CarouselItem>
      ))}
    </Carousel>,
  )
  const track = screen.getByLabelText('Modelos')
  fireEvent(track, 'layout', { nativeEvent: { layout: { width: 300, height: 200 } } })
  const scrollTo = jest.fn()
  const instance = screen.UNSAFE_getByType(ScrollView).instance as { scrollTo: typeof scrollTo }
  instance.scrollTo = scrollTo
  const scrollTrack = (x: number) =>
    fireEvent.scroll(track, { nativeEvent: { contentOffset: { x, y: 0 } } })
  return { track, scrollTo, scrollTrack }
}

const dot = (n: number) => screen.getByRole('button', { name: `Ir para o item ${n}` })

describe('Carousel', () => {
  it('mostra os itens, um ponto por item e as setas', () => {
    setup()
    expect(screen.getByText('Boas-vindas')).toBeOnTheScreen()
    expect(screen.getByText('Pedido')).toBeOnTheScreen()
    expect(screen.getAllByRole('button', { name: /Ir para o item/ })).toHaveLength(3)
    expect(screen.getByLabelText('1 de 3')).toBeOnTheScreen()
  })

  it('cada item tem 78% da largura do carrossel', () => {
    setup()
    expect(screen.getByLabelText('2 de 3').props.style).toMatchObject({ width: 234 })
  })

  it('começa no primeiro item, com "anterior" desabilitado', () => {
    setup()
    expect(dot(1).props.accessibilityState.selected).toBe(true)
    expect(screen.getByRole('button', { name: 'Item anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Próximo item' })).toBeEnabled()
  })

  it('"próximo" e os pontos rolam até o encaixe do item', () => {
    const { scrollTo } = setup()
    fireEvent.press(screen.getByRole('button', { name: 'Próximo item' }))
    expect(scrollTo).toHaveBeenLastCalledWith({ x: 250, animated: true })
    fireEvent.press(dot(3))
    expect(scrollTo).toHaveBeenLastCalledWith({ x: 434, animated: true })
  })

  it('acompanha a rolagem: ponto ativo e onIndexChange', () => {
    const onIndexChange = jest.fn()
    const { scrollTrack } = setup({ onIndexChange })
    scrollTrack(240)
    expect(dot(2).props.accessibilityState.selected).toBe(true)
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
    expect(screen.getByRole('button', { name: 'Item anterior' })).toBeEnabled()
    scrollTrack(245) // mesmo item: não avisa de novo
    expect(onIndexChange).toHaveBeenCalledTimes(1)
  })

  it('o fim da rolagem vale como último item e desabilita "próximo"', () => {
    const onIndexChange = jest.fn()
    const { scrollTrack } = setup({ onIndexChange })
    scrollTrack(434)
    expect(dot(3).props.accessibilityState.selected).toBe(true)
    expect(screen.getByRole('button', { name: 'Próximo item' })).toBeDisabled()
    expect(onIndexChange).toHaveBeenLastCalledWith(2)
  })

  it('"anterior" volta um item', () => {
    const { scrollTo, scrollTrack } = setup()
    scrollTrack(250)
    fireEvent.press(screen.getByRole('button', { name: 'Item anterior' }))
    expect(scrollTo).toHaveBeenLastCalledWith({ x: 0, animated: true })
  })

  it('itemRatio muda a largura dos itens', () => {
    setup({ itemRatio: 1 })
    expect(screen.getByLabelText('1 de 3').props.style).toMatchObject({ width: 300 })
  })

  it('pode esconder os pontos e as setas', () => {
    const { unmount } = render(
      <Carousel label="A" showDots={false}>
        <CarouselItem>
          <Text>x</Text>
        </CarouselItem>
      </Carousel>,
    )
    expect(screen.queryByRole('button', { name: /Ir para o item/ })).toBeNull()
    expect(screen.getByRole('button', { name: 'Próximo item' })).toBeOnTheScreen()
    unmount()
    render(
      <Carousel label="B" showArrows={false}>
        <CarouselItem>
          <Text>x</Text>
        </CarouselItem>
      </Carousel>,
    )
    expect(screen.queryByRole('button', { name: 'Próximo item' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Ir para o item 1' })).toBeOnTheScreen()
  })

  it('aceita rótulos próprios', () => {
    setup({ previousLabel: 'Voltar', nextLabel: 'Avançar', dotLabel: (i) => `Modelo ${i + 1}` })
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Avançar' })).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Modelo 2' })).toBeOnTheScreen()
  })
})
