import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Breadcrumb, BreadcrumbItem } from './breadcrumb'

function Example({ onHome }: { onHome?: () => void }) {
  return (
    <Breadcrumb>
      <BreadcrumbItem onPress={onHome}>Início</BreadcrumbItem>
      <BreadcrumbItem>Produtos</BreadcrumbItem>
      <BreadcrumbItem current>Camiseta</BreadcrumbItem>
    </Breadcrumb>
  )
}

describe('Breadcrumb', () => {
  it('tem nome acessível padrão e permite trocar', () => {
    const { unmount } = render(<Example />)
    expect(screen.getByLabelText('Breadcrumb')).toBeTruthy()
    unmount()
    render(<Breadcrumb accessibilityLabel="Você está aqui" />)
    expect(screen.getByLabelText('Você está aqui')).toBeTruthy()
  })

  it('itens não atuais são links e disparam onPress', () => {
    const onHome = jest.fn()
    render(<Example onHome={onHome} />)
    expect(screen.getAllByRole('link')).toHaveLength(2)
    fireEvent.press(screen.getByRole('link', { name: 'Início' }))
    expect(onHome).toHaveBeenCalledTimes(1)
  })

  it('o item atual não é link e fica selecionado', () => {
    render(<Example />)
    expect(screen.queryByRole('link', { name: 'Camiseta' })).toBeNull()
    expect(screen.getByText('Camiseta').props.className).toContain('font-medium')
    expect(screen.getAllByRole('text', { name: 'Camiseta' })[0]).toBeSelected()
  })

  it('mostra o separador depois de todos, menos do último', () => {
    render(<Example />)
    // Cada separador é um SVG (ChevronRightIcon).
    expect(screen.UNSAFE_getAllByType(require('react-native-svg').Svg)).toHaveLength(2)
  })

  it('aceita nós como conteúdo e className no item', () => {
    render(
      <Breadcrumb className="px-2" testID="root">
        <BreadcrumbItem className="gap-4" testID="x">
          <Text>Nó</Text>
        </BreadcrumbItem>
      </Breadcrumb>,
    )
    expect(screen.getByTestId('root').props.className).toContain('px-2')
    expect(screen.getByText('Nó')).toBeTruthy()
  })
})
