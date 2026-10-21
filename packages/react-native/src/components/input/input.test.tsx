import { fireEvent, render, screen } from '@testing-library/react-native'
import { Pressable, Text, TextInput } from 'react-native'
import { Input } from './input'

const input = () => screen.getByPlaceholderText('voce@empresa.com')

describe('Input', () => {
  it('renderiza com placeholder e dispara onChangeText', () => {
    const onChangeText = jest.fn()
    render(<Input placeholder="voce@empresa.com" onChangeText={onChangeText} />)
    fireEvent.changeText(input(), 'abc')
    expect(onChangeText).toHaveBeenCalledWith('abc')
  })

  it('usa md por padrão e aplica o tamanho', () => {
    const { rerender } = render(<Input placeholder="voce@empresa.com" />)
    expect(input().props.className).toContain('h-12')
    rerender(<Input placeholder="voce@empresa.com" size="sm" />)
    expect(input().props.className).toContain('h-10')
    rerender(<Input placeholder="voce@empresa.com" size="lg" />)
    expect(input().props.className).toContain('h-14')
  })

  it('error usa a borda de erro', () => {
    render(<Input placeholder="voce@empresa.com" error />)
    expect(input().props.className).toContain('border-field-border-error')
    expect(input().props.className).not.toContain('border-field-border ')
  })

  it('disabled bloqueia a edição e muda o estilo', () => {
    render(<Input placeholder="voce@empresa.com" disabled />)
    expect(input().props.editable).toBe(false)
    expect(input().props.className).toContain('bg-field-bg-disabled')
    expect(input().props.accessibilityState).toMatchObject({ disabled: true })
  })

  it('readOnly bloqueia a edição e esconde a borda', () => {
    render(<Input placeholder="voce@empresa.com" readOnly />)
    expect(input().props.editable).toBe(false)
    expect(input().props.className).toContain('border-transparent')
  })

  it('tem o foco como borda na cor do anel', () => {
    render(<Input placeholder="voce@empresa.com" />)
    expect(input().props.className).toContain('focus:border-field-focus-ring')
  })

  it('renderiza ícones e recua o texto conforme o tamanho', () => {
    const { rerender } = render(
      <Input
        placeholder="voce@empresa.com"
        leadingIcon={<Text>L</Text>}
        trailingIcon={<Text>T</Text>}
      />,
    )
    expect(screen.getByText('L')).toBeTruthy()
    expect(screen.getByText('T')).toBeTruthy()
    expect(input().props.className).toContain('pl-11')
    expect(input().props.className).toContain('pr-11')
    rerender(<Input placeholder="voce@empresa.com" size="sm" leadingIcon={<Text>L</Text>} />)
    expect(input().props.className).toContain('pl-9')
  })

  it('deixa o className do consumidor vencer', () => {
    render(<Input placeholder="voce@empresa.com" className="h-20" />)
    expect(input().props.className).toContain('h-20')
    expect(input().props.className).not.toContain('h-12')
  })

  describe('ícones interativos', () => {
    // o `View` do slot: o primeiro ancestral do ícone que define `pointerEvents`
    const slotOf = (text: string) => {
      let node = screen.getByText(text).parent
      while (node && node.props.pointerEvents === undefined) node = node.parent
      return node
    }

    it.each(['leadingIcon', 'trailingIcon'] as const)(
      'um Pressable em %s recebe o próprio toque',
      (slot) => {
        const onPress = jest.fn()
        const icon = (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mostrar senha"
            onPress={onPress}
          >
            <Text>olho</Text>
          </Pressable>
        )
        render(<Input placeholder="voce@empresa.com" {...{ [slot]: icon }} />)
        fireEvent.press(screen.getByRole('button', { name: 'Mostrar senha' }))
        expect(onPress).toHaveBeenCalledTimes(1)
      },
    )

    it('o slot não intercepta o toque (box-none), para a área vazia cair no campo', () => {
      render(
        <Input
          placeholder="voce@empresa.com"
          leadingIcon={<Text>L</Text>}
          trailingIcon={<Text>T</Text>}
        />,
      )
      expect(slotOf('L')?.props.pointerEvents).toBe('box-none')
      expect(slotOf('T')?.props.pointerEvents).toBe('box-none')
    })

    it('tocar num ícone que não trata o toque foca o campo', () => {
      const focus = jest.spyOn(TextInput.prototype, 'focus').mockImplementation(() => {})
      render(<Input placeholder="voce@empresa.com" trailingIcon={<Text>T</Text>} />)
      const slot = slotOf('T')
      expect(slot?.props.onStartShouldSetResponder()).toBe(true)
      slot?.props.onResponderRelease()
      expect(focus).toHaveBeenCalledTimes(1)
      focus.mockRestore()
    })

    it('desabilitado, o ícone não reivindica o toque', () => {
      render(<Input placeholder="voce@empresa.com" disabled trailingIcon={<Text>T</Text>} />)
      expect(slotOf('T')?.props.onStartShouldSetResponder()).toBe(false)
    })
  })
})
