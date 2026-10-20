import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Button } from './button'

const button = () => screen.getByRole('button')

describe('Button', () => {
  it('renderiza o label e dispara onPress', () => {
    const onPress = jest.fn()
    render(<Button onPress={onPress}>Salvar</Button>)
    fireEvent.press(screen.getByRole('button', { name: 'Salvar' }))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('usa primary md por padrão', () => {
    render(<Button>Salvar</Button>)
    expect(button().props.className).toContain('bg-button-primary-bg')
    expect(button().props.className).toContain('h-11')
  })

  it.each([
    ['secondary', 'bg-button-secondary-bg'],
    ['tertiary', 'border-button-tertiary-border'],
    ['ghost', 'bg-transparent'],
    ['destructive', 'bg-button-destructive-bg'],
  ] as const)('variante %s', (variant, expected) => {
    render(<Button variant={variant}>Salvar</Button>)
    expect(button().props.className).toContain(expected)
  })

  it('aplica o tamanho e deixa o className do consumidor vencer', () => {
    render(
      <Button size="lg" className="h-20">
        Salvar
      </Button>,
    )
    expect(button().props.className).toContain('h-20')
    expect(button().props.className).not.toContain('h-14')
  })

  it('desabilita e marca busy durante loading', () => {
    const onPress = jest.fn()
    render(
      <Button loading onPress={onPress}>
        Salvar
      </Button>,
    )
    expect(button()).toBeDisabled()
    expect(button().props.accessibilityState).toMatchObject({ busy: true, disabled: true })
    expect(screen.getByRole('progressbar')).toBeTruthy()
    fireEvent.press(button())
    expect(onPress).not.toHaveBeenCalled()
  })

  it('usa o texto desabilitado, com variante própria no destructive', () => {
    render(
      <>
        <Button disabled>Um</Button>
        <Button disabled variant="destructive">
          Dois
        </Button>
      </>,
    )
    expect(screen.getByText('Um').props.className).toContain('text-button-disabled-text')
    expect(screen.getByText('Dois').props.className).toContain(
      'text-button-disabled-text-destructive',
    )
  })

  it('renderiza ícones fora do loading', () => {
    render(
      <Button leadingIcon={<Text>L</Text>} trailingIcon={<Text>T</Text>}>
        Ok
      </Button>,
    )
    expect(screen.getByText('L')).toBeTruthy()
    expect(screen.getByText('T')).toBeTruthy()
  })
})
