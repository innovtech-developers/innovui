import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { FlatList } from 'react-native'
import { Lightbox } from './lightbox'

beforeEach(() => jest.useFakeTimers())
afterEach(() => {
  // a lista e a saída animada agendam trabalho: deixa terminar dentro do act
  act(() => jest.runOnlyPendingTimers())
  jest.useRealTimers()
})

// A saída é animada: o conteúdo só some depois dela.
const settle = () => act(() => jest.advanceTimersByTime(500))

const items = [
  { src: 'https://x.test/estrada.jpg', alt: 'Estrada entre montanhas' },
  { src: 'https://x.test/ceu.jpg', alt: 'Céu estrelado' },
  { src: 'https://x.test/cha.jpg', alt: 'Chá e livro' },
]
const WIDTH = 750 // largura da janela no Jest

function setup(props: Partial<Parameters<typeof Lightbox>[0]> = {}) {
  const view = render(<Lightbox items={items} open {...props} />)
  const scrollToIndex = jest.fn()
  const list = view.UNSAFE_queryByType(FlatList)
  if (list) (list.instance as { scrollToIndex: typeof scrollToIndex }).scrollToIndex = scrollToIndex
  return { ...view, scrollToIndex, list }
}

describe('Lightbox', () => {
  it('não renderiza nada fechado', () => {
    render(<Lightbox items={items} />)
    expect(screen.queryByText('1 / 3')).toBeNull()
    expect(screen.queryByLabelText('Estrada entre montanhas')).toBeNull()
  })

  it('mostra as fotos, o contador e os botões', () => {
    setup()
    expect(screen.getByLabelText('Visualizador de imagens')).toBeOnTheScreen()
    expect(screen.getByLabelText('Estrada entre montanhas')).toBeOnTheScreen()
    expect(screen.getByText('1 / 3')).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Foto anterior' })).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Próxima foto' })).toBeOnTheScreen()
  })

  it('as setas avançam e voltam, dando a volta nas pontas', () => {
    const { scrollToIndex } = setup()
    fireEvent.press(screen.getByRole('button', { name: 'Foto anterior' }))
    expect(scrollToIndex).toHaveBeenLastCalledWith({ index: 2, animated: true })
    expect(screen.getByText('3 / 3')).toBeOnTheScreen()
    fireEvent.press(screen.getByRole('button', { name: 'Próxima foto' }))
    expect(scrollToIndex).toHaveBeenLastCalledWith({ index: 0, animated: true })
    expect(screen.getByText('1 / 3')).toBeOnTheScreen()
  })

  it('deslizar troca de foto e avisa onIndexChange', () => {
    const onIndexChange = jest.fn()
    const { list } = setup({ onIndexChange })
    fireEvent(list as never, 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: WIDTH, y: 0 } },
    })
    expect(screen.getByText('2 / 3')).toBeOnTheScreen()
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
  })

  it('no modo controlado a foto segue `index` e a lista rola até ela', () => {
    const onIndexChange = jest.fn()
    const { rerender, scrollToIndex } = setup({ index: 1, onIndexChange })
    expect(screen.getByText('2 / 3')).toBeOnTheScreen()
    fireEvent.press(screen.getByRole('button', { name: 'Próxima foto' }))
    expect(onIndexChange).toHaveBeenCalledWith(2)
    // sem o pai atualizar o índice, o contador não muda
    expect(screen.getByText('2 / 3')).toBeOnTheScreen()
    scrollToIndex.mockClear()
    rerender(<Lightbox items={items} open index={0} onIndexChange={onIndexChange} />)
    expect(screen.getByText('1 / 3')).toBeOnTheScreen()
    expect(scrollToIndex).toHaveBeenLastCalledWith({ index: 0, animated: false })
  })

  it('o botão de fechar chama onOpenChange(false)', () => {
    const onOpenChange = jest.fn()
    setup({ onOpenChange })
    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('ao fechar, a saída é animada e depois o conteúdo some', () => {
    const { rerender } = setup()
    rerender(<Lightbox items={items} open={false} />)
    expect(screen.getByText('1 / 3')).toBeOnTheScreen()
    settle()
    expect(screen.queryByText('1 / 3')).toBeNull()
  })

  it('com uma só foto não mostra setas nem contador', () => {
    setup({ items: items.slice(0, 1) })
    expect(screen.queryByRole('button', { name: 'Próxima foto' })).toBeNull()
    expect(screen.queryByText(/\//)).toBeNull()
  })

  it('aceita rótulos próprios', () => {
    setup({ label: 'Fotos', closeLabel: 'Sair', previousLabel: 'Voltar', nextLabel: 'Avançar' })
    expect(screen.getByLabelText('Fotos')).toBeOnTheScreen()
    for (const name of ['Sair', 'Voltar', 'Avançar']) {
      expect(screen.getByRole('button', { name })).toBeOnTheScreen()
    }
  })
})
