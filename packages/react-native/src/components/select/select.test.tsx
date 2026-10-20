import { fireEvent, render, screen } from '@testing-library/react-native'
import { View } from 'react-native'
import { Select, SelectOption } from './select'

// O mock de View do Jest não mede nada; devolvemos um retângulo para o overlay abrir.
beforeAll(() => {
  jest
    .spyOn(View.prototype as unknown as { measureInWindow: () => void }, 'measureInWindow')
    .mockImplementation(((cb: (x: number, y: number, w: number, h: number) => void) =>
      cb(16, 100, 300, 48)) as never)
})

function renderSelect(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  return render(
    <Select accessibilityLabel="Workspace" {...props}>
      <SelectOption value="ops">Operações</SelectOption>
      <SelectOption value="mkt">Marketing</SelectOption>
      <SelectOption value="fin" disabled>
        Financeiro
      </SelectOption>
    </Select>,
  )
}

const trigger = () => screen.getByRole('combobox')

describe('Select', () => {
  it('renderiza com placeholder', () => {
    renderSelect({ placeholder: 'Escolha um workspace' })
    expect(screen.getByText('Escolha um workspace')).toBeTruthy()
    expect(trigger().props.accessibilityState).toMatchObject({ expanded: false, disabled: false })
  })

  it('abre a lista e seleciona uma opção', () => {
    const onValueChange = jest.fn()
    renderSelect({ onValueChange })
    expect(screen.queryByText('Marketing')).toBeNull()
    fireEvent.press(trigger())
    expect(trigger().props.accessibilityState.expanded).toBe(true)
    fireEvent.press(screen.getByRole('option', { name: 'Marketing' }))
    expect(onValueChange).toHaveBeenCalledWith('mkt')
    expect(screen.getByText('Marketing')).toBeTruthy()
    expect(trigger().props.accessibilityState.expanded).toBe(false)
  })

  it('modo controlado só muda quando o pai muda', () => {
    const { rerender } = renderSelect({ value: 'ops' })
    expect(screen.getByText('Operações')).toBeTruthy()
    fireEvent.press(trigger())
    fireEvent.press(screen.getByRole('option', { name: 'Marketing' }))
    expect(screen.getByText('Operações')).toBeTruthy()
    rerender(
      <Select value="mkt" accessibilityLabel="Workspace">
        <SelectOption value="ops">Operações</SelectOption>
        <SelectOption value="mkt">Marketing</SelectOption>
      </Select>,
    )
    expect(screen.getByText('Marketing')).toBeTruthy()
  })

  it('defaultValue mostra o rótulo e marca a opção selecionada', () => {
    renderSelect({ defaultValue: 'mkt' })
    expect(screen.getByText('Marketing')).toBeTruthy()
    fireEvent.press(trigger())
    expect(
      screen.getByRole('option', { name: 'Marketing' }).props.accessibilityState,
    ).toMatchObject({ selected: true })
    expect(
      screen.getByRole('option', { name: 'Operações' }).props.accessibilityState,
    ).toMatchObject({ selected: false })
  })

  it('opção desabilitada não seleciona', () => {
    const onValueChange = jest.fn()
    renderSelect({ onValueChange })
    fireEvent.press(trigger())
    const option = screen.getByRole('option', { name: 'Financeiro' })
    expect(option.props.accessibilityState.disabled).toBe(true)
    fireEvent.press(option)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('disabled e readOnly não abrem', () => {
    renderSelect({ disabled: true })
    fireEvent.press(trigger())
    expect(screen.queryByText('Marketing')).toBeNull()
    expect(trigger().props.className).toContain('bg-field-bg-disabled')
  })

  it('readOnly não abre e usa fundo desabilitado sem borda', () => {
    renderSelect({ readOnly: true })
    fireEvent.press(trigger())
    expect(screen.queryByText('Marketing')).toBeNull()
    expect(trigger().props.className).toContain('border-transparent')
  })

  it('aplica tamanho, erro e className', () => {
    renderSelect({ size: 'lg', error: true, className: 'mt-2' })
    expect(trigger().props.className).toContain('h-14')
    expect(trigger().props.className).toContain('border-field-border-error')
    expect(trigger().props.className).toContain('mt-2')
  })

  it('aberto usa a borda do anel de foco', () => {
    renderSelect()
    fireEvent.press(trigger())
    expect(trigger().props.className).toContain('border-field-focus-ring')
  })

  it('o rótulo acessível vem de accessibilityLabel', () => {
    renderSelect()
    expect(screen.getByLabelText('Workspace')).toBeTruthy()
  })
})
