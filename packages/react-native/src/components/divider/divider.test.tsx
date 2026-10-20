import { render, screen } from '@testing-library/react-native'
import { Divider } from './divider'

describe('Divider', () => {
  it('horizontal por padrão, com a cor de borda', () => {
    render(<Divider testID="d" />)
    const cls = screen.getByTestId('d').props.className
    expect(cls).toContain('h-px')
    expect(cls).toContain('w-full')
    expect(cls).toContain('bg-border-default')
  })

  it('vertical', () => {
    render(<Divider testID="d" orientation="vertical" />)
    const cls = screen.getByTestId('d').props.className
    expect(cls).toContain('w-px')
    expect(cls).toContain('self-stretch')
    expect(cls).not.toContain('h-px')
  })

  it('é decorativo para leitores de tela', () => {
    render(<Divider testID="d" />)
    expect(screen.getByTestId('d').props.importantForAccessibility).toBe('no')
  })

  it('className do consumidor vence', () => {
    render(<Divider testID="d" className="bg-border-strong" />)
    const cls = screen.getByTestId('d').props.className
    expect(cls).toContain('bg-border-strong')
    expect(cls).not.toContain('bg-border-default')
  })
})
