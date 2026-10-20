import { fireEvent, render, screen } from '@testing-library/react-native'
import { Calendar } from './calendar'

const oct19 = new Date(2026, 9, 19)

// o nome do dia é "quinta-feira, 22 de outubro de 2026": ancorar na vírgula evita que "5" ache "15"
// sobe do botão até a célula da grade (o wrapper que carrega a faixa do período)
const cellOf = (el: ReturnType<typeof screen.getByRole>) => {
  let node = el.parent
  while (node && !String(node.props.className ?? '').includes('flex-1')) node = node.parent
  return node
}
const named = (name: RegExp) => screen.getByRole('button', { name })
const day = (text: string) => named(new RegExp(`, ${text}`))

describe('Calendar', () => {
  it('mostra o mês e o ano da data escolhida, em português, com 7 dias de semana', () => {
    render(<Calendar value={oct19} />)
    expect(screen.getByRole('header')).toHaveTextContent(/outubro de 2026/i)
    expect(screen.getAllByRole('button', { name: /de outubro de 2026/ })).toHaveLength(31)
    for (const heading of ['dom.', 'seg.', 'sáb.']) expect(screen.getByText(heading)).toBeTruthy()
  })

  it('o dia escolhido fica selected', () => {
    render(<Calendar value={oct19} />)
    expect(named(/^segunda-feira, 19 de outubro de 2026$/).props.accessibilityState.selected).toBe(
      true,
    )
    expect(named(/^terça-feira, 20 de outubro/).props.accessibilityState.selected).toBe(false)
  })

  it('tocar num dia chama onValueChange com a data', () => {
    const onValueChange = jest.fn()
    render(<Calendar value={oct19} onValueChange={onValueChange} />)
    fireEvent.press(named(/^quinta-feira, 22 de outubro/))
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange.mock.calls[0]?.[0]).toEqual(new Date(2026, 9, 22))
  })

  it('no modo não controlado, guarda a escolha', () => {
    render(<Calendar defaultValue={oct19} />)
    fireEvent.press(named(/^quinta-feira, 22 de outubro/))
    expect(named(/^quinta-feira, 22 de outubro/).props.accessibilityState.selected).toBe(true)
  })

  it('no modo controlado, a escolha só muda pelo pai', () => {
    render(<Calendar value={oct19} />)
    fireEvent.press(named(/^quinta-feira, 22 de outubro/))
    expect(named(/^quinta-feira, 22 de outubro/).props.accessibilityState.selected).toBe(false)
  })

  it('o dia escolhido recebe o destaque primário', () => {
    render(<Calendar value={oct19} />)
    expect(named(/^segunda-feira, 19 de outubro/).props.className).toContain('bg-button-primary-bg')
    expect(named(/^terça-feira, 20 de outubro/).props.className).not.toContain(
      'bg-button-primary-bg ',
    )
  })

  it('weekStartsOn muda a ordem dos cabeçalhos', () => {
    render(<Calendar value={oct19} weekStartsOn={1} />)
    const labels = screen.getAllByText(/\.$/).map((n) => n.props.children)
    expect(labels[0]).toBe('seg.')
    expect(labels[6]).toBe('dom.')
  })

  it('locale muda os nomes', () => {
    render(<Calendar value={oct19} locale="en-US" />)
    expect(screen.getByRole('header')).toHaveTextContent(/October 2026/)
    expect(named(/^Monday, October 19, 2026$/)).toBeTruthy()
  })

  it('setas navegam entre meses', () => {
    render(<Calendar value={oct19} />)
    fireEvent.press(screen.getByRole('button', { name: 'Próximo mês' }))
    expect(screen.getByRole('header')).toHaveTextContent(/novembro de 2026/i)
    fireEvent.press(screen.getByRole('button', { name: 'Mês anterior' }))
    fireEvent.press(screen.getByRole('button', { name: 'Mês anterior' }))
    expect(screen.getByRole('header')).toHaveTextContent(/setembro de 2026/i)
  })

  it('rótulos das setas são configuráveis', () => {
    render(<Calendar value={oct19} previousMonthLabel="Voltar" nextMonthLabel="Avançar" />)
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Avançar' })).toBeTruthy()
  })

  it('minDate e maxDate desabilitam dias e travam a navegação', () => {
    const onValueChange = jest.fn()
    render(
      <Calendar
        value={oct19}
        minDate={new Date(2026, 9, 10)}
        maxDate={new Date(2026, 9, 25)}
        onValueChange={onValueChange}
      />,
    )
    expect(named(/^quinta-feira, 8 de outubro/).props.accessibilityState.disabled).toBe(true)
    expect(named(/^segunda-feira, 26 de outubro/).props.accessibilityState.disabled).toBe(true)
    expect(named(/^quinta-feira, 22 de outubro/).props.accessibilityState.disabled).toBe(false)
    fireEvent.press(named(/^quinta-feira, 8 de outubro/))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(
      screen.getByRole('button', { name: 'Mês anterior' }).props.accessibilityState.disabled,
    ).toBe(true)
    expect(
      screen.getByRole('button', { name: 'Próximo mês' }).props.accessibilityState.disabled,
    ).toBe(true)
  })

  it('sem valor, abre no mês de hoje e destaca o dia de hoje', () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 21, 12) })
    render(<Calendar />)
    expect(screen.getByRole('header')).toHaveTextContent(/outubro de 2026/i)
    expect(screen.getByText('21').props.className).toContain('text-text-brand')
    expect(screen.getByText('22').props.className).not.toContain('text-text-brand')
    jest.useRealTimers()
  })

  describe('modo range', () => {
    it('primeiro toque define o início; o segundo, o fim', () => {
      const onValueChange = jest.fn()
      render(<Calendar mode="range" value={{}} onValueChange={onValueChange} />)
      fireEvent.press(day('10 de outubro'))
      expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 9, 10) })
    })

    it('segundo toque completa o período e a faixa aparece entre as pontas', () => {
      const onValueChange = jest.fn()
      render(
        <Calendar
          mode="range"
          defaultValue={{ from: new Date(2026, 9, 10) }}
          onValueChange={onValueChange}
        />,
      )
      fireEvent.press(day('14 de outubro'))
      expect(onValueChange).toHaveBeenLastCalledWith({
        from: new Date(2026, 9, 10),
        to: new Date(2026, 9, 14),
      })
      const cell = (text: string) => cellOf(day(text))
      expect(cell('10 de outubro')?.props.className).toContain('rounded-l-full')
      expect(cell('14 de outubro')?.props.className).toContain('rounded-r-full')
      expect(cell('12 de outubro')?.props.className).toContain('bg-button-secondary-bg')
      expect(day('12 de outubro').props.accessibilityState.selected).toBe(true)
      expect(cell('16 de outubro')?.props.className).not.toContain('bg-button-secondary-bg')
    })

    it('dia anterior ao início recomeça o período', () => {
      const onValueChange = jest.fn()
      render(
        <Calendar
          mode="range"
          value={{ from: new Date(2026, 9, 10) }}
          onValueChange={onValueChange}
        />,
      )
      fireEvent.press(day('5 de outubro'))
      expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 9, 5) })
    })

    it('um dia só não desenha faixa', () => {
      const d = new Date(2026, 9, 10)
      render(<Calendar mode="range" value={{ from: d, to: d }} />)
      expect(cellOf(day('10 de outubro'))?.props.className).not.toContain('rounded-l-full')
    })
  })

  it('aplica className e testID', () => {
    render(<Calendar value={oct19} className="w-full" testID="cal" />)
    expect(screen.getByTestId('cal').props.className).toContain('w-full')
    expect(screen.getByTestId('cal').props.className).not.toContain('w-70')
  })
})
