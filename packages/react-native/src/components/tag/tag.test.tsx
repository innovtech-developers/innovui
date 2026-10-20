import { fireEvent, render, screen } from '@testing-library/react-native'
import { Tag } from './tag'

describe('Tag', () => {
  it('renderiza o texto, filled por padrão, sem botão de remover', () => {
    render(<Tag testID="t">Design</Tag>)
    expect(screen.getByText('Design')).toBeTruthy()
    expect(screen.getByTestId('t').props.className).toContain('bg-bg-secondary')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('outline usa borda', () => {
    render(
      <Tag testID="t" variant="outline">
        Design
      </Tag>,
    )
    expect(screen.getByTestId('t').props.className).toContain('border-border-default')
    expect(screen.getByTestId('t').props.className).not.toContain('bg-bg-secondary')
  })

  it('onDismiss mostra o botão de remover e o chama ao tocar', () => {
    const onDismiss = jest.fn()
    render(<Tag onDismiss={onDismiss}>Design</Tag>)
    fireEvent.press(screen.getByRole('button', { name: 'Remover' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('dismissLabel personaliza o nome do botão', () => {
    render(
      <Tag onDismiss={() => {}} dismissLabel="Remover Design">
        Design
      </Tag>,
    )
    expect(screen.getByRole('button', { name: 'Remover Design' })).toBeTruthy()
  })

  it('className do consumidor vence', () => {
    render(
      <Tag testID="t" className="px-4">
        Design
      </Tag>,
    )
    expect(screen.getByTestId('t').props.className).not.toContain('px-2')
  })
})
