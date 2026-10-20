import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { IconButton } from './icon-button'

const button = () => screen.getByRole('button')

describe('IconButton', () => {
  it('usa o accessibilityLabel como nome e dispara onPress', () => {
    const onPress = jest.fn()
    render(
      <IconButton accessibilityLabel="Fechar" onPress={onPress}>
        <Text>x</Text>
      </IconButton>,
    )
    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('usa primary md por padrão', () => {
    render(
      <IconButton accessibilityLabel="Fechar">
        <Text>x</Text>
      </IconButton>,
    )
    expect(button().props.className).toContain('bg-button-primary-bg')
    expect(button().props.className).toContain('size-11')
  })

  it.each([
    ['secondary', 'bg-button-secondary-bg'],
    ['tertiary', 'border-button-tertiary-border'],
    ['ghost', 'bg-transparent'],
    ['destructive', 'bg-button-destructive-bg'],
  ] as const)('variante %s', (variant, expected) => {
    render(
      <IconButton accessibilityLabel="Fechar" variant={variant}>
        <Text>x</Text>
      </IconButton>,
    )
    expect(button().props.className).toContain(expected)
  })

  it('aplica o tamanho e deixa o className do consumidor vencer', () => {
    render(
      <IconButton accessibilityLabel="Fechar" size="lg" className="size-20">
        <Text>x</Text>
      </IconButton>,
    )
    expect(button().props.className).toContain('size-20')
    expect(button().props.className).not.toContain('size-14')
  })

  it('desabilita e marca busy durante loading', () => {
    const onPress = jest.fn()
    render(
      <IconButton accessibilityLabel="Fechar" loading onPress={onPress}>
        <Text>x</Text>
      </IconButton>,
    )
    expect(button()).toBeDisabled()
    expect(button().props.accessibilityState).toMatchObject({ busy: true, disabled: true })
    expect(screen.getByRole('progressbar')).toBeTruthy()
    expect(screen.queryByText('x')).toBeNull()
    fireEvent.press(button())
    expect(onPress).not.toHaveBeenCalled()
  })

  it('desabilitado não dispara onPress', () => {
    const onPress = jest.fn()
    render(
      <IconButton accessibilityLabel="Fechar" disabled onPress={onPress}>
        <Text>x</Text>
      </IconButton>,
    )
    expect(button()).toBeDisabled()
    fireEvent.press(button())
    expect(onPress).not.toHaveBeenCalled()
  })
})
