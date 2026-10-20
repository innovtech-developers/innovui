import { fireEvent, render, screen } from '@testing-library/react-native'
import { View } from 'react-native'
import { Combobox, type ComboboxOption } from './combobox'

beforeAll(() => {
  jest
    .spyOn(View.prototype as unknown as { measureInWindow: () => void }, 'measureInWindow')
    .mockImplementation(((cb: (x: number, y: number, w: number, h: number) => void) =>
      cb(16, 100, 300, 48)) as never)
})

const options: ComboboxOption[] = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais', disabled: true },
]

const trigger = () => screen.getByRole('combobox')
const open = () => fireEvent.press(trigger())

function renderCombobox(props: Partial<React.ComponentProps<typeof Combobox>> = {}) {
  return render(<Combobox accessibilityLabel="Estado" options={options} {...props} />)
}

describe('Combobox', () => {
  it('mostra o placeholder e abre a lista com todas as opções', () => {
    renderCombobox({ placeholder: 'Escolha' })
    expect(screen.getByText('Escolha')).toBeTruthy()
    expect(screen.queryByText('São Paulo')).toBeNull()
    open()
    expect(trigger().props.accessibilityState.expanded).toBe(true)
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('escolher uma opção chama onValueChange, fecha e mostra o rótulo', () => {
    const onValueChange = jest.fn()
    renderCombobox({ onValueChange })
    open()
    fireEvent.press(screen.getByRole('option', { name: 'Rio de Janeiro' }))
    expect(onValueChange).toHaveBeenCalledWith('rj')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText('Rio de Janeiro')).toBeTruthy()
  })

  it('filtra ignorando acento e maiúsculas e mostra mensagem vazia', () => {
    renderCombobox({ emptyMessage: 'Nada' })
    open()
    fireEvent.changeText(screen.getByLabelText('Buscar...'), 'SAO')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: 'São Paulo' })).toBeTruthy()
    fireEvent.changeText(screen.getByLabelText('Buscar...'), 'zzz')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText('Nada')).toBeTruthy()
  })

  it('reabrir descarta a busca anterior', () => {
    renderCombobox()
    open()
    fireEvent.changeText(screen.getByLabelText('Buscar...'), 'rio')
    fireEvent.press(screen.getByRole('option', { name: 'Rio de Janeiro' }))
    open()
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('marca a opção selecionada e respeita defaultValue', () => {
    renderCombobox({ defaultValue: 'sp' })
    expect(screen.getByText('São Paulo')).toBeTruthy()
    open()
    expect(
      screen.getByRole('option', { name: 'São Paulo' }).props.accessibilityState.selected,
    ).toBe(true)
  })

  it('modo controlado só muda pelo pai', () => {
    const { rerender } = renderCombobox({ value: 'sp' })
    open()
    fireEvent.press(screen.getByRole('option', { name: 'Rio de Janeiro' }))
    expect(screen.getByText('São Paulo')).toBeTruthy()
    rerender(<Combobox accessibilityLabel="Estado" options={options} value="rj" />)
    expect(screen.getByText('Rio de Janeiro')).toBeTruthy()
  })

  it('opção desabilitada não seleciona', () => {
    const onValueChange = jest.fn()
    renderCombobox({ onValueChange })
    open()
    fireEvent.press(screen.getByRole('option', { name: 'Minas Gerais' }))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('disabled e readOnly não abrem', () => {
    const { unmount } = renderCombobox({ disabled: true })
    open()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(trigger().props.className).toContain('bg-field-bg-disabled')
    unmount()
    renderCombobox({ readOnly: true })
    open()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('aplica tamanho, erro e className', () => {
    renderCombobox({ size: 'sm', error: true, className: 'mt-2' })
    expect(trigger().props.className).toContain('h-10')
    expect(trigger().props.className).toContain('border-field-border-error')
    expect(trigger().props.className).toContain('mt-2')
  })
})
