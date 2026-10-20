import { fireEvent, render, screen } from '@testing-library/react-native'
import { DateRangePicker } from './date-range-picker'

const range = { from: new Date(2026, 9, 10), to: new Date(2026, 9, 14) }
const trigger = () => screen.getByRole('combobox')
const day = (text: string) => screen.getByRole('button', { name: new RegExp(`, ${text}`) })

describe('DateRangePicker', () => {
  it('mostra o placeholder, o período e o período parcial', () => {
    const { rerender } = render(<DateRangePicker />)
    expect(screen.getByText('dd/mm/aaaa – dd/mm/aaaa')).toBeTruthy()
    rerender(<DateRangePicker value={range} />)
    expect(screen.getByText('10/10/2026 – 14/10/2026')).toBeTruthy()
    rerender(<DateRangePicker value={{ from: range.from }} />)
    expect(screen.getByText('10/10/2026 – …')).toBeTruthy()
  })

  it('o primeiro toque mantém aberto; o segundo completa e fecha', () => {
    const onValueChange = jest.fn()
    render(<DateRangePicker defaultValue={{ from: range.from }} onValueChange={onValueChange} />)
    fireEvent.press(trigger())
    fireEvent.press(day('5 de outubro'))
    expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 9, 5) })
    expect(screen.getByRole('header')).toBeTruthy()
    fireEvent.press(day('12 de outubro'))
    expect(onValueChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 9, 5),
      to: new Date(2026, 9, 12),
    })
    expect(screen.queryByRole('header')).toBeNull()
    expect(screen.getByText('05/10/2026 – 12/10/2026')).toBeTruthy()
  })

  it('controlado só muda pelo pai', () => {
    render(<DateRangePicker value={range} />)
    fireEvent.press(trigger())
    fireEvent.press(day('20 de outubro'))
    fireEvent.press(day('22 de outubro'))
    expect(screen.getByText('10/10/2026 – 14/10/2026')).toBeTruthy()
  })

  it('sem presets não mostra atalhos', () => {
    render(<DateRangePicker value={range} />)
    fireEvent.press(trigger())
    expect(screen.queryByText('Últimos 7 dias')).toBeNull()
  })

  it('presets={true} mostra os padrão e aplicar um fecha o painel', () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 21, 12) })
    const onValueChange = jest.fn()
    render(<DateRangePicker presets onValueChange={onValueChange} />)
    fireEvent.press(trigger())
    fireEvent.press(screen.getByRole('button', { name: 'Últimos 7 dias' }))
    expect(onValueChange).toHaveBeenCalledWith({
      from: new Date(2026, 9, 15),
      to: new Date(2026, 9, 21),
    })
    expect(screen.queryByRole('header')).toBeNull()
    jest.useRealTimers()
  })

  it('aceita lista própria de presets, marca o ativo e desabilita os fora dos limites', () => {
    const presets = [
      { label: 'Primeira semana', range: { from: new Date(2026, 9, 1), to: new Date(2026, 9, 7) } },
      { label: 'Segunda semana', range: { from: new Date(2026, 9, 8), to: new Date(2026, 9, 14) } },
    ]
    render(
      <DateRangePicker
        value={presets[0]?.range}
        presets={presets}
        minDate={new Date(2026, 9, 2)}
      />,
    )
    fireEvent.press(trigger())
    const first = screen.getByRole('button', { name: 'Primeira semana' })
    const second = screen.getByRole('button', { name: 'Segunda semana' })
    expect(first.props.accessibilityState).toMatchObject({ selected: true, disabled: true })
    expect(second.props.accessibilityState).toMatchObject({ selected: false, disabled: false })
  })

  it('disabled e readOnly não abrem', () => {
    const { unmount } = render(<DateRangePicker disabled />)
    fireEvent.press(trigger())
    expect(screen.queryByRole('header')).toBeNull()
    unmount()
    render(<DateRangePicker readOnly value={range} />)
    fireEvent.press(trigger())
    expect(screen.queryByRole('header')).toBeNull()
  })

  it('aplica tamanho, erro e className ao gatilho', () => {
    render(<DateRangePicker size="lg" error className="mt-2" />)
    expect(trigger().props.className).toContain('h-14')
    expect(trigger().props.className).toContain('border-field-border-error')
    expect(trigger().props.className).toContain('mt-2')
  })
})
