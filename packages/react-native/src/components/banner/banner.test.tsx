import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Banner } from './banner'

describe('Banner', () => {
  it('renderiza a mensagem, info por padrão, sem role alert', () => {
    render(<Banner testID="a">Mensagem</Banner>)
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
      <Banner testID="a" status={status}>
        Mensagem
      </Banner>,
    )
    expect(screen.getByTestId('a').props.className).toContain(bg)
    expect(screen.getByTestId('a').props.accessibilityRole).toBe(role)
  })

  it('aceita nós como children e mostra a ação', () => {
    render(
      <Banner action={<Text>Desfazer</Text>}>
        <Text>Custom</Text>
      </Banner>,
    )
    expect(screen.getByText('Custom')).toBeTruthy()
    expect(screen.getByText('Desfazer')).toBeTruthy()
  })

  it('não mostra o botão de fechar sem onDismiss', () => {
    render(<Banner>Mensagem</Banner>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('onDismiss mostra o botão de fechar e o chama ao tocar', () => {
    const onDismiss = jest.fn()
    render(<Banner onDismiss={onDismiss}>Mensagem</Banner>)
    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('dismissLabel personaliza o nome do botão', () => {
    render(
      <Banner onDismiss={() => {}} dismissLabel="Dispensar">
        Mensagem
      </Banner>,
    )
    expect(screen.getByRole('button', { name: 'Dispensar' })).toBeTruthy()
  })

  it('className do consumidor vence', () => {
    render(
      <Banner testID="a" className="px-8">
        Mensagem
      </Banner>,
    )
    expect(screen.getByTestId('a').props.className).toContain('px-8')
    expect(screen.getByTestId('a').props.className).not.toContain('px-4')
  })
})
