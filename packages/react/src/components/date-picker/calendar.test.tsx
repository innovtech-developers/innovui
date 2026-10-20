import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Calendar } from './calendar'

const oct19 = new Date(2026, 9, 19)

// o nome do dia é "quinta-feira, 22 de outubro de 2026": ancorar na vírgula evita que "5" ache "15"
const day = (text: string) => screen.getByRole('button', { name: new RegExp(`, ${text}`) })
const named = (name: RegExp) => screen.getByRole('button', { name })

describe('Calendar', () => {
  it('mostra o mês e o ano da data escolhida, em português', () => {
    render(<Calendar value={oct19} />)
    expect(screen.getByRole('grid', { name: /outubro de 2026/i })).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(7)
    expect(screen.getAllByRole('button', { name: /de outubro de 2026/ })).toHaveLength(31)
  })

  it('o dia tem nome completo e o escolhido fica com aria-selected', () => {
    render(<Calendar value={oct19} />)
    const selected = named(/^segunda-feira, 19 de outubro de 2026$/)
    expect(selected.closest('td')).toHaveAttribute('aria-selected', 'true')
    expect(named(/^terça-feira, 20 de outubro/).closest('td')).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })

  it('clicar num dia chama onValueChange com a data', async () => {
    const onValueChange = vi.fn()
    render(<Calendar value={oct19} onValueChange={onValueChange} />)
    await userEvent.click(named(/^quinta-feira, 22 de outubro/))
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange.mock.calls[0]?.[0]).toEqual(new Date(2026, 9, 22))
  })

  it('no modo não controlado, guarda a escolha', async () => {
    render(<Calendar defaultValue={oct19} />)
    await userEvent.click(named(/^quinta-feira, 22 de outubro/))
    expect(named(/^quinta-feira, 22 de outubro/).closest('td')).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('só o dia do cursor recebe Tab (roving tabindex)', () => {
    render(<Calendar value={oct19} />)
    const focusable = screen
      .getAllByRole('button', { name: /de outubro de 2026/ })
      .filter((b) => b.tabIndex === 0)
    expect(focusable).toHaveLength(1)
    expect(focusable[0]).toHaveAccessibleName(/19 de outubro/)
  })

  it('autoFocus foca o dia escolhido ao montar', () => {
    render(<Calendar value={oct19} autoFocus />)
    expect(day('19 de outubro')).toHaveFocus()
  })

  it('setas movem o foco por dia e por semana', async () => {
    render(<Calendar value={oct19} autoFocus />)
    await userEvent.keyboard('{ArrowRight}')
    expect(day('20 de outubro')).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(day('27 de outubro')).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}{ArrowUp}')
    expect(day('19 de outubro')).toHaveFocus()
  })

  it('Home e End vão ao começo e ao fim da semana', async () => {
    render(<Calendar value={oct19} autoFocus />)
    await userEvent.keyboard('{Home}')
    expect(day('18 de outubro')).toHaveFocus() // domingo
    await userEvent.keyboard('{End}')
    expect(day('24 de outubro')).toHaveFocus() // sábado
  })

  it('weekStartsOn muda o começo da semana e o Home', async () => {
    render(<Calendar value={oct19} weekStartsOn={1} autoFocus />)
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent(/seg/i)
    await userEvent.keyboard('{Home}')
    expect(day('19 de outubro')).toHaveFocus() // já é segunda
  })

  it('setas atravessam o mês e o título acompanha', async () => {
    render(<Calendar value={new Date(2026, 9, 31)} autoFocus />)
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('grid', { name: /novembro de 2026/i })).toBeInTheDocument()
    expect(day('1 de novembro')).toHaveFocus()
  })

  it('PageUp/PageDown trocam o mês, e com Shift trocam o ano', async () => {
    render(<Calendar value={oct19} autoFocus />)
    await userEvent.keyboard('{PageDown}')
    expect(day('19 de novembro de 2026')).toHaveFocus()
    await userEvent.keyboard('{PageUp}{PageUp}')
    expect(day('19 de setembro de 2026')).toHaveFocus()
    await userEvent.keyboard('{Shift>}{PageDown}{/Shift}')
    expect(day('19 de setembro de 2027')).toHaveFocus()
  })

  it('outras teclas não fazem nada', async () => {
    render(<Calendar value={oct19} autoFocus />)
    await userEvent.keyboard('a')
    expect(day('19 de outubro')).toHaveFocus()
  })

  it('os botões de mês navegam sem mexer na escolha', async () => {
    render(<Calendar value={oct19} />)
    await userEvent.click(screen.getByRole('button', { name: 'Próximo mês' }))
    expect(screen.getByRole('grid', { name: /novembro de 2026/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Mês anterior' }))
    await userEvent.click(screen.getByRole('button', { name: 'Mês anterior' }))
    expect(screen.getByRole('grid', { name: /setembro de 2026/i })).toBeInTheDocument()
  })

  it('minDate e maxDate desabilitam dias, setas de mês e param o teclado', async () => {
    render(
      <Calendar
        value={oct19}
        minDate={new Date(2026, 9, 10)}
        maxDate={new Date(2026, 9, 25)}
        autoFocus
      />,
    )
    expect(day('9 de outubro')).toBeDisabled()
    expect(day('10 de outubro')).toBeEnabled()
    expect(day('26 de outubro')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Mês anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Próximo mês' })).toBeDisabled()
    await userEvent.keyboard('{End}{ArrowRight}{ArrowRight}')
    expect(day('25 de outubro')).toHaveFocus()
  })

  it('o cursor inicial respeita o intervalo permitido', () => {
    render(<Calendar value={new Date(2026, 9, 1)} minDate={new Date(2026, 9, 5)} />)
    const focusable = screen
      .getAllByRole('button', { name: /de outubro de 2026/ })
      .filter((b) => b.tabIndex === 0)
    expect(focusable[0]).toHaveAccessibleName(/5 de outubro/)
  })

  it('sem valor, começa no mês de hoje e marca hoje com aria-current', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 2, 8))
    render(<Calendar />)
    expect(screen.getByRole('grid', { name: /março de 2026/i })).toBeInTheDocument()
    expect(day('8 de março')).toHaveAttribute('aria-current', 'date')
    vi.useRealTimers()
  })

  it('os rótulos dos botões de mês são configuráveis', () => {
    render(<Calendar value={oct19} previousMonthLabel="Voltar" nextMonthLabel="Avançar" />)
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Avançar' })).toBeInTheDocument()
  })

  it('locale muda os nomes', () => {
    render(<Calendar value={oct19} locale="en-US" />)
    expect(screen.getByRole('grid', { name: /october 2026/i })).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Calendar value={oct19} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  describe('mode="range"', () => {
    const cell = (n: number) => day(`${n} de outubro`).closest('td') as HTMLElement

    it('o primeiro clique define o início e avisa só com from', async () => {
      const onValueChange = vi.fn()
      render(<Calendar mode="range" value={{}} onValueChange={onValueChange} />)
      await userEvent.click(day('12 de outubro'))
      expect(onValueChange).toHaveBeenCalledWith({ from: new Date(2026, 9, 12) })
    })

    it('o segundo clique completa o período e avisa com from e to', async () => {
      const onValueChange = vi.fn()
      render(
        <Calendar
          mode="range"
          value={{ from: new Date(2026, 9, 12) }}
          onValueChange={onValueChange}
        />,
      )
      await userEvent.click(day('18 de outubro'))
      expect(onValueChange).toHaveBeenCalledWith({
        from: new Date(2026, 9, 12),
        to: new Date(2026, 9, 18),
      })
    })

    it('no modo não controlado, guarda o período entre os cliques', async () => {
      render(<Calendar mode="range" defaultValue={{ from: new Date(2026, 9, 12) }} />)
      await userEvent.click(day('15 de outubro'))
      expect(cell(12)).toHaveAttribute('aria-selected', 'true')
      expect(cell(14)).toHaveAttribute('aria-selected', 'true')
      expect(cell(15)).toHaveAttribute('aria-selected', 'true')
      expect(cell(16)).toHaveAttribute('aria-selected', 'false')
    })

    it('marca o início, o meio e o fim, com a faixa contínua e as pontas arredondadas', () => {
      render(
        <Calendar
          mode="range"
          value={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 16) }}
        />,
      )
      for (const n of [12, 13, 14, 15, 16]) expect(cell(n)).toHaveAttribute('aria-selected', 'true')
      expect(cell(11)).toHaveAttribute('aria-selected', 'false')
      expect(cell(17)).toHaveAttribute('aria-selected', 'false')
      expect(cell(12)).toHaveClass('iu:rounded-l-full', 'iu:bg-[var(--color-button-secondary-bg)]')
      expect(cell(16)).toHaveClass('iu:rounded-r-full', 'iu:bg-[var(--color-button-secondary-bg)]')
      expect(cell(14)).toHaveClass('iu:bg-[var(--color-button-secondary-bg)]')
      expect(cell(14)).not.toHaveClass('iu:rounded-l-full', 'iu:rounded-r-full')
      expect(day('12 de outubro')).toHaveClass('iu:bg-[var(--color-button-primary-bg)]')
      expect(day('16 de outubro')).toHaveClass('iu:bg-[var(--color-button-primary-bg)]')
      expect(day('14 de outubro')).not.toHaveClass('iu:bg-[var(--color-button-primary-bg)]')
    })

    it('um período de um dia só é um círculo, sem faixa', () => {
      const one = new Date(2026, 9, 12)
      render(<Calendar mode="range" value={{ from: one, to: one }} />)
      expect(cell(12)).toHaveAttribute('aria-selected', 'true')
      expect(cell(12).className).not.toContain('rounded-')
      expect(cell(12).className).not.toContain('button-secondary-bg')
    })

    it('só com o início, marca apenas ele', () => {
      render(<Calendar mode="range" value={{ from: new Date(2026, 9, 12) }} />)
      expect(cell(12)).toHaveAttribute('aria-selected', 'true')
      expect(cell(13)).toHaveAttribute('aria-selected', 'false')
    })

    it('abre no mês do início e foca ele', () => {
      render(<Calendar mode="range" value={{ from: new Date(2026, 10, 3) }} autoFocus />)
      expect(screen.getByRole('grid', { name: /novembro de 2026/i })).toBeInTheDocument()
      expect(day('3 de novembro')).toHaveFocus()
    })

    it('a faixa atravessa semanas e funciona pelo teclado', async () => {
      const onValueChange = vi.fn()
      render(
        <Calendar
          mode="range"
          value={{ from: new Date(2026, 9, 12) }}
          onValueChange={onValueChange}
          autoFocus
        />,
      )
      await userEvent.keyboard('{ArrowDown}{Enter}')
      expect(onValueChange).toHaveBeenCalledWith({
        from: new Date(2026, 9, 12),
        to: new Date(2026, 9, 19),
      })
    })

    it('não tem violações de acessibilidade', async () => {
      const { container } = render(
        <Calendar
          mode="range"
          value={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 16) }}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
