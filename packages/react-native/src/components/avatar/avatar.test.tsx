import { fireEvent, render, screen } from '@testing-library/react-native'
import { Image } from 'react-native'
import { Avatar } from './avatar'

describe('Avatar', () => {
  it('expõe o nome como rótulo de imagem', () => {
    render(<Avatar name="Maria Silva" />)
    expect(screen.getByRole('image', { name: 'Maria Silva' })).toBeTruthy()
  })

  it('mostra as iniciais sem src (primeira e última palavra)', () => {
    render(<Avatar name="Maria de Souza Silva" />)
    expect(screen.getByText('MS')).toBeTruthy()
  })

  it('uma palavra só dá uma inicial', () => {
    render(<Avatar name="  ana " />)
    expect(screen.getByText('A')).toBeTruthy()
  })

  it('renderiza a imagem com src', () => {
    const { UNSAFE_getByType } = render(<Avatar name="Maria Silva" src="https://x.test/a.png" />)
    expect(UNSAFE_getByType(Image).props.source).toEqual({ uri: 'https://x.test/a.png' })
    expect(screen.queryByText('MS')).toBeNull()
  })

  it('volta às iniciais quando a imagem falha', () => {
    const { UNSAFE_getByType } = render(<Avatar name="Maria Silva" src="https://x.test/a.png" />)
    fireEvent(UNSAFE_getByType(Image), 'error')
    expect(screen.getByText('MS')).toBeTruthy()
  })

  it('tamanho md por padrão e sm/lg; className vence', () => {
    const { rerender } = render(<Avatar testID="a" name="A B" />)
    expect(screen.getByTestId('a').props.className).toContain('size-10')
    rerender(<Avatar testID="a" name="A B" size="lg" className="size-20" />)
    expect(screen.getByTestId('a').props.className).toContain('size-20')
    expect(screen.getByTestId('a').props.className).not.toContain('size-14')
    rerender(<Avatar testID="a" name="A B" size="sm" />)
    expect(screen.getByTestId('a').props.className).toContain('size-8')
  })
})
