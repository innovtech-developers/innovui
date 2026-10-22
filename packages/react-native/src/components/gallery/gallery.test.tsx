import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { Image } from 'react-native'
import { Gallery } from './gallery'

beforeEach(() => jest.useFakeTimers())
afterEach(() => {
  // a lista e a saída animada agendam trabalho: deixa terminar dentro do act
  act(() => jest.runOnlyPendingTimers())
  jest.useRealTimers()
})

// A saída é animada: o conteúdo só some depois dela.
const settle = () => act(() => jest.advanceTimersByTime(500))

const items = [
  {
    src: 'https://x.test/estrada.jpg',
    alt: 'Estrada entre montanhas',
    thumbSrc: 'https://x.test/estrada-p.jpg',
  },
  { src: 'https://x.test/ceu.jpg', alt: 'Céu estrelado' },
  { src: 'https://x.test/cha.jpg', alt: 'Chá e livro' },
]

function setup(props: Partial<Parameters<typeof Gallery>[0]> = {}) {
  render(<Gallery items={items} testID="g" {...props} />)
  fireEvent(screen.getByTestId('g'), 'layout', {
    nativeEvent: { layout: { width: 316, height: 400 } },
  })
}

describe('Gallery', () => {
  it('mostra uma miniatura por foto, com nome acessível', () => {
    setup()
    expect(screen.getAllByRole('imagebutton')).toHaveLength(3)
    expect(
      screen.getByRole('imagebutton', { name: 'Ampliar foto 1: Estrada entre montanhas' }),
    ).toBeOnTheScreen()
  })

  it('usa thumbSrc na grade e cai para src sem ele', () => {
    setup()
    const sources = screen.UNSAFE_getAllByType(Image).map((img) => img.props.source.uri)
    expect(sources).toEqual([
      'https://x.test/estrada-p.jpg',
      'https://x.test/ceu.jpg',
      'https://x.test/cha.jpg',
    ])
  })

  it('2 colunas no celular: cada miniatura tem (316 − 8) / 2 de largura, em 4:3', () => {
    setup()
    const style = screen.getAllByRole('imagebutton')[0]?.props.style
    expect(style).toMatchObject({ width: 154, aspectRatio: 4 / 3 })
  })

  it('columns muda a grade', () => {
    setup({ columns: 3 })
    expect(screen.getAllByRole('imagebutton')[0]?.props.style).toMatchObject({ width: 100 })
  })

  it('tocar numa miniatura abre o lightbox naquela foto', () => {
    setup()
    expect(screen.queryByText('2 / 3')).toBeNull()
    fireEvent.press(screen.getByRole('imagebutton', { name: /Ampliar foto 2/ }))
    expect(screen.getByText('2 / 3')).toBeOnTheScreen()
    expect(screen.getByLabelText('Visualizador de imagens')).toBeOnTheScreen()
  })

  it('fechar o lightbox volta para a grade', () => {
    setup()
    fireEvent.press(screen.getByRole('imagebutton', { name: /Ampliar foto 1/ }))
    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }))
    settle()
    expect(screen.queryByText('1 / 3')).toBeNull()
  })

  it('aceita rótulos próprios', () => {
    setup({ openLabel: (item) => `Abrir ${item.alt}`, lightboxLabel: 'Anexos ampliados' })
    fireEvent.press(screen.getByRole('imagebutton', { name: 'Abrir Chá e livro' }))
    expect(screen.getByLabelText('Anexos ampliados')).toBeOnTheScreen()
  })
})
