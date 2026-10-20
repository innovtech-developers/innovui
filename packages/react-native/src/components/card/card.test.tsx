import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Card } from './card'

describe('Card', () => {
  it('renderiza os filhos com borda, fundo elevado e padding md', () => {
    render(
      <Card testID="c">
        <Text>Conteúdo</Text>
      </Card>,
    )
    expect(screen.getByText('Conteúdo')).toBeTruthy()
    const cls = screen.getByTestId('c').props.className
    expect(cls).toContain('bg-surface-elevated')
    expect(cls).toContain('border-border-default')
    expect(cls).toContain('p-4')
  })

  it.each([
    ['none', undefined],
    ['lg', 'p-6'],
  ] as const)('padding %s', (padding, expected) => {
    render(<Card testID="c" padding={padding} />)
    const cls = screen.getByTestId('c').props.className
    expect(cls).not.toContain('p-4')
    if (expected) expect(cls).toContain(expected)
  })

  it('className do consumidor vence', () => {
    render(<Card testID="c" className="p-8" />)
    expect(screen.getByTestId('c').props.className).toContain('p-8')
    expect(screen.getByTestId('c').props.className).not.toContain('p-4')
  })
})
