import { render, screen } from '@testing-library/react-native'
import { Badge } from './badge'

describe('Badge', () => {
  it('renderiza o texto e usa neutral por padrão', () => {
    render(<Badge testID="b">Rascunho</Badge>)
    expect(screen.getByText('Rascunho').props.className).toContain('text-status-neutral-text')
    expect(screen.getByTestId('b').props.className).toContain('bg-status-neutral-bg')
  })

  it.each([
    ['success', 'bg-status-success-bg', 'text-status-success-text'],
    ['error', 'bg-status-error-bg', 'text-status-error-text'],
    ['warning', 'bg-status-warning-bg', 'text-status-warning-text'],
    ['info', 'bg-status-info-bg', 'text-status-info-text'],
    ['pending', 'bg-status-pending-bg', 'text-status-pending-text'],
  ] as const)('status %s', (status, bg, text) => {
    render(
      <Badge testID="b" status={status}>
        Texto
      </Badge>,
    )
    expect(screen.getByTestId('b').props.className).toContain(bg)
    expect(screen.getByText('Texto').props.className).toContain(text)
  })

  it('mostra o ponto só com dot, escondido do leitor de tela', () => {
    const { rerender } = render(
      <Badge testID="b" status="success">
        Ok
      </Badge>,
    )
    expect(screen.getByTestId('b').children).toHaveLength(1)
    rerender(
      <Badge testID="b" status="success" dot>
        Ok
      </Badge>,
    )
    expect(screen.getByTestId('b').children).toHaveLength(2)
  })

  it('className do consumidor vence', () => {
    render(
      <Badge testID="b" className="px-4">
        Ok
      </Badge>,
    )
    expect(screen.getByTestId('b').props.className).toContain('px-4')
    expect(screen.getByTestId('b').props.className).not.toContain('px-2')
  })
})
