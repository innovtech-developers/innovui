import { fireEvent, render, screen } from '@testing-library/react-native'
import { DatePicker } from './date-picker'

const oct19 = new Date(2026, 9, 19)
const trigger = () => screen.getByRole('combobox')
const day = (text: string) => screen.getByRole('button', { name: new RegExp(`, ${text}`) })

describe('DatePicker', () => {
  it('mostra o placeholder e, com valor, a data formatada', () => {
    const { rerender } = render(<DatePicker accessibilityLabel="Vencimento" />)
    expect(screen.getByText('dd/mm/aaaa')).toBeTruthy()
    rerender(<DatePicker accessibilityLabel="Vencimento" value={oct19} />)
    expect(screen.getByText('19/10/2026')).toBeTruthy()
    expect(screen.getByLabelText('Vencimento')).toBeTruthy()
  })

  it('placeholder e locale são configuráveis', () => {
    const { rerender } = render(<DatePicker placeholder="Escolha o dia" />)
    expect(screen.getByText('Escolha o dia')).toBeTruthy()
    rerender(<DatePicker locale="en-US" value={oct19} />)
    expect(screen.getByText('10/19/2026')).toBeTruthy()
  })

  it('abre o calendário e escolhe um dia, fechando em seguida', () => {
    const onValueChange = jest.fn()
    render(<DatePicker value={oct19} onValueChange={onValueChange} />)
    expect(screen.queryByRole('header')).toBeNull()
    fireEvent.press(trigger())
    expect(trigger().props.accessibilityState.expanded).toBe(true)
    expect(screen.getByRole('header')).toHaveTextContent(/outubro de 2026/i)
    fireEvent.press(day('22 de outubro'))
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 9, 22))
    expect(screen.queryByRole('header')).toBeNull()
  })

  it('não controlado guarda o dia escolhido', () => {
    render(<DatePicker defaultValue={oct19} />)
    fireEvent.press(trigger())
    fireEvent.press(day('22 de outubro'))
    expect(screen.getByText('22/10/2026')).toBeTruthy()
  })

  it('controlado só muda pelo pai', () => {
    render(<DatePicker value={oct19} />)
    fireEvent.press(trigger())
    fireEvent.press(day('22 de outubro'))
    expect(screen.getByText('19/10/2026')).toBeTruthy()
  })

  it('repassa minDate e maxDate ao calendário', () => {
    render(
      <DatePicker value={oct19} minDate={new Date(2026, 9, 10)} maxDate={new Date(2026, 9, 25)} />,
    )
    fireEvent.press(trigger())
    expect(day('8 de outubro').props.accessibilityState.disabled).toBe(true)
    expect(day('26 de outubro').props.accessibilityState.disabled).toBe(true)
  })

  it('disabled e readOnly não abrem', () => {
    const { unmount } = render(<DatePicker disabled />)
    fireEvent.press(trigger())
    expect(screen.queryByRole('header')).toBeNull()
    expect(trigger().props.className).toContain('bg-field-bg-disabled')
    unmount()
    render(<DatePicker readOnly value={oct19} />)
    fireEvent.press(trigger())
    expect(screen.queryByRole('header')).toBeNull()
    expect(trigger().props.className).toContain('border-transparent')
  })

  it('aplica tamanho, erro e className ao gatilho', () => {
    render(<DatePicker size="sm" error className="mt-2" />)
    expect(trigger().props.className).toContain('h-10')
    expect(trigger().props.className).toContain('border-field-border-error')
    expect(trigger().props.className).toContain('mt-2')
  })
})
