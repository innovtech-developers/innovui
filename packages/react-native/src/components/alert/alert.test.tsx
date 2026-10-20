import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Alert } from './alert'

describe('Alert', () => {
  it('renderiza a mensagem, info por padrão, sem role alert', () => {
    render(<Alert testID="a">Mensagem</Alert>)
    expect(screen.getByText('Mensagem')).toBeTruthy()
    expect(screen.getByTestId('a').props.className).toContain('bg-status-info-bg')
    expect(screen.getByTestId('a').props.accessibilityRole).toBeUndefined()
  })

  it.each([
    ['success', 'bg-status-success-bg', undefined],
    ['error', 'bg-status-error-bg', 'alert'],
    ['warning', 'bg-status-warning-bg', 'alert'],
    ['neutral', 'bg-status-neutral-bg', undefined],
  ] as const)('status %s', (status, bg, role) => {
    render(
      <Alert testID="a" status={status}>
        Mensagem
      </Alert>,
    )
    expect(screen.getByTestId('a').props.className).toContain(bg)
    expect(screen.getByTestId('a').props.accessibilityRole).toBe(role)
  })

  it('aceita nós como children e mostra a ação', () => {
    render(
      <Alert action={<Text>Desfazer</Text>}>
        <Text>Custom</Text>
      </Alert>,
    )
    expect(screen.getByText('Custom')).toBeTruthy()
    expect(screen.getByText('Desfazer')).toBeTruthy()
  })

  it('não mostra o botão de fechar sem onDismiss', () => {
    render(<Alert>Mensagem</Alert>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('onDismiss mostra o botão de fechar e o chama ao tocar', () => {
    const onDismiss = jest.fn()
    render(<Alert onDismiss={onDismiss}>Mensagem</Alert>)
    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('dismissLabel personaliza o nome do botão', () => {
    render(
      <Alert onDismiss={() => {}} dismissLabel="Dispensar">
        Mensagem
      </Alert>,
    )
    expect(screen.getByRole('button', { name: 'Dispensar' })).toBeTruthy()
  })

  it('className do consumidor vence', () => {
    render(
      <Alert testID="a" className="px-8">
        Mensagem
      </Alert>,
    )
    expect(screen.getByTestId('a').props.className).toContain('px-8')
    expect(screen.getByTestId('a').props.className).not.toContain('px-4')
  })

  it('mostra o título e a borda do status', () => {
    render(
      <Alert testID="a" status="error" title="Falha">
        Mensagem
      </Alert>,
    )
    expect(screen.getByText('Falha').props.className).toContain('text-status-error-text')
    expect(screen.getByTestId('a').props.className).toContain('border-status-error-border')
  })
})
