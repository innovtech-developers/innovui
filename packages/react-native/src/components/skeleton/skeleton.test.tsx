import { render, screen } from '@testing-library/react-native'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('usa a variante text por padrão e é escondido do leitor de tela', () => {
    render(<Skeleton testID="s" />)
    const el = screen.getByTestId('s', { hidden: true })
    expect(el.props.className).toContain('h-3')
    expect(el.props.className).toContain('w-full')
    expect(el.props.accessibilityElementsHidden).toBe(true)
    expect(el.props.importantForAccessibility).toBe('no-hide-descendants')
  })

  it.each([
    ['title', 'h-5'],
    ['avatar', 'rounded-full'],
    ['card', 'h-[120px]'],
    ['rectangle', 'h-6'],
  ] as const)('variante %s', (variant, expected) => {
    render(<Skeleton testID="s" variant={variant} />)
    expect(screen.getByTestId('s', { hidden: true }).props.className).toContain(expected)
  })

  it('className do consumidor vence', () => {
    render(<Skeleton testID="s" className="w-[200px]" />)
    const cls = screen.getByTestId('s', { hidden: true }).props.className
    expect(cls).toContain('w-[200px]')
    expect(cls).not.toContain('w-full')
  })

  it('desmonta sem erro (para o loop)', () => {
    const { unmount } = render(<Skeleton />)
    expect(() => unmount()).not.toThrow()
  })
})
