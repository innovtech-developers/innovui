import { render, screen } from '@testing-library/react-native'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('expõe role progressbar com label padrão', () => {
    render(<Spinner />)
    expect(screen.getByRole('progressbar', { name: 'Carregando' })).toBeTruthy()
  })

  it('aplica o tamanho por className e aceita override', () => {
    render(<Spinner size="lg" className="size-8" accessibilityLabel="Salvando" />)
    const node = screen.getByRole('progressbar', { name: 'Salvando' })
    expect(node.props.className).toBe('shrink-0 size-8')
  })
})
