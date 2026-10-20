import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Field } from '../field'
import { DateRangePicker } from './date-range-picker'

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const range = { from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) }
const button = () => screen.getByRole('button', { name: 'Período' })
const day = (text: string) => screen.getByRole('button', { name: new RegExp(`, ${text}`) })

describe('DateRangePicker', () => {
  it('sem período mostra o placeholder, que é configurável', () => {
    const { unmount } = render(<DateRangePicker aria-label="Período" />)
    expect(button()).toHaveTextContent('dd/mm/aaaa – dd/mm/aaaa')
    unmount()
    render(<DateRangePicker aria-label="Período" placeholder="Escolha as datas" />)
    expect(button()).toHaveTextContent('Escolha as datas')
  })

  it('com período mostra início – fim', () => {
    render(<DateRangePicker aria-label="Período" defaultValue={range} />)
    expect(button()).toHaveTextContent('12/10/2026 – 18/10/2026')
  })

  it('só com o início mostra reticências no fim', () => {
    render(<DateRangePicker aria-label="Período" defaultValue={{ from: range.from }} />)
    expect(button()).toHaveTextContent('12/10/2026 – …')
  })

  it('abre o calendário no mês do início, com o início focado', async () => {
    render(<DateRangePicker aria-label="Período" defaultValue={range} />)
    await userEvent.click(button())
    expect(await screen.findByRole('dialog', { name: 'Escolher período' })).toBeInTheDocument()
    expect(screen.getByRole('grid', { name: /outubro de 2026/i })).toBeInTheDocument()
    expect(day('12 de outubro')).toHaveFocus()
  })

  it('o primeiro clique mantém aberto; o segundo completa, avisa e fecha', async () => {
    const onValueChange = vi.fn()
    render(<DateRangePicker aria-label="Período" onValueChange={onValueChange} />)
    await userEvent.click(button())
    const today = new Date()
    await userEvent.click(await screen.findByRole('button', { name: /, 10 de/ }))
    expect(onValueChange).toHaveBeenLastCalledWith({
      from: new Date(today.getFullYear(), today.getMonth(), 10),
    })
    expect(screen.getByRole('grid')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /, 20 de/ }))
    expect(onValueChange).toHaveBeenLastCalledWith({
      from: new Date(today.getFullYear(), today.getMonth(), 10),
      to: new Date(today.getFullYear(), today.getMonth(), 20),
    })
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    expect(button()).toHaveTextContent(/10\/\d\d\/\d{4} – 20\/\d\d\/\d{4}/)
  })

  it('funciona controlado', async () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <DateRangePicker aria-label="Período" value={range} onValueChange={onValueChange} />,
    )
    await userEvent.click(button())
    await userEvent.click(await screen.findByRole('button', { name: /, 22 de outubro/ }))
    expect(onValueChange).toHaveBeenCalledWith({ from: new Date(2026, 9, 22) })
    expect(button()).toHaveTextContent('12/10/2026 – 18/10/2026')
    rerender(<DateRangePicker aria-label="Período" value={{ from: new Date(2026, 9, 22) }} />)
    expect(button()).toHaveTextContent('22/10/2026 – …')
  })

  it('Esc fecha e devolve o foco ao botão', async () => {
    render(<DateRangePicker aria-label="Período" defaultValue={range} />)
    await userEvent.click(button())
    await screen.findByRole('grid')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    expect(button()).toHaveFocus()
  })

  it('minDate e maxDate chegam ao calendário', async () => {
    render(
      <DateRangePicker
        aria-label="Período"
        defaultValue={range}
        minDate={new Date(2026, 9, 10)}
        maxDate={new Date(2026, 9, 20)}
      />,
    )
    await userEvent.click(button())
    expect(await screen.findByRole('button', { name: /, 9 de outubro/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /, 21 de outubro/ })).toBeDisabled()
  })

  it('fromName e toName enviam aaaa-mm-dd em campos ocultos', () => {
    const first = render(
      <DateRangePicker aria-label="Período" fromName="inicio" toName="fim" defaultValue={range} />,
    )
    const hidden = () => [...first.container.querySelectorAll('input[type="hidden"]')]
    expect(hidden().map((i) => [i.getAttribute('name'), (i as HTMLInputElement).value])).toEqual([
      ['inicio', '2026-10-12'],
      ['fim', '2026-10-18'],
    ])
    first.unmount()
    const second = render(<DateRangePicker aria-label="Período" fromName="inicio" toName="fim" />)
    expect(
      [...second.container.querySelectorAll('input[type="hidden"]')].map(
        (i) => (i as HTMLInputElement).value,
      ),
    ).toEqual(['', ''])
  })

  it('sem fromName/toName não cria campos ocultos', () => {
    const { container } = render(<DateRangePicker aria-label="Período" defaultValue={range} />)
    expect(container.querySelector('input[type="hidden"]')).toBeNull()
  })

  it('desabilitado não abre; somente leitura mostra o período mas não abre', async () => {
    const disabled = render(<DateRangePicker aria-label="Período" disabled />)
    expect(button()).toBeDisabled()
    disabled.unmount()
    render(<DateRangePicker aria-label="Período" readOnly defaultValue={range} />)
    await userEvent.click(button())
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    expect(button()).toHaveTextContent('12/10/2026 – 18/10/2026')
  })

  it('error marca aria-invalid; size e className chegam ao botão', () => {
    render(<DateRangePicker aria-label="Período" error size="sm" className="iu:max-w-xs" />)
    expect(button()).toHaveAttribute('aria-invalid', 'true')
    expect(button()).toHaveClass('iu:h-10', 'iu:max-w-xs')
  })

  it('funciona dentro de um Field', () => {
    render(
      <Field label="Hospedagem" supportingText="Entrada e saída">
        <DateRangePicker />
      </Field>,
    )
    expect(screen.getByRole('button', { name: /Hospedagem/ })).toHaveAccessibleDescription(
      'Entrada e saída',
    )
  })

  it('não tem violações de acessibilidade, fechado e aberto', async () => {
    const { container } = render(<DateRangePicker aria-label="Período" defaultValue={range} />)
    expect(await axe(container)).toHaveNoViolations()
    await userEvent.click(button())
    expect(await axe(await screen.findByRole('dialog'))).toHaveNoViolations()
  })

  describe('presets', () => {
    const custom = [
      {
        label: 'Semana de teste',
        range: { from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) },
      },
      { label: 'Fim do mês', range: { from: new Date(2026, 9, 26), to: new Date(2026, 9, 31) } },
    ]

    it('sem presets não mostra atalhos', async () => {
      render(<DateRangePicker aria-label="Período" defaultValue={range} />)
      await userEvent.click(button())
      await screen.findByRole('grid')
      expect(screen.queryByRole('button', { name: 'Hoje' })).not.toBeInTheDocument()
    })

    it('presets={true} mostra os cinco atalhos padrão', async () => {
      render(<DateRangePicker aria-label="Período" presets />)
      await userEvent.click(button())
      for (const label of [
        'Hoje',
        'Últimos 7 dias',
        'Últimos 30 dias',
        'Este mês',
        'Mês passado',
      ]) {
        expect(await screen.findByRole('button', { name: label })).toBeInTheDocument()
      }
    })

    it('uma lista própria mostra só os seus atalhos', async () => {
      render(<DateRangePicker aria-label="Período" presets={custom} />)
      await userEvent.click(button())
      expect(await screen.findByRole('button', { name: 'Semana de teste' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Fim do mês' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Hoje' })).not.toBeInTheDocument()
    })

    it('escolher um atalho define o período completo, avisa e fecha', async () => {
      const onValueChange = vi.fn()
      render(
        <DateRangePicker aria-label="Período" presets={custom} onValueChange={onValueChange} />,
      )
      await userEvent.click(button())
      await userEvent.click(await screen.findByRole('button', { name: 'Semana de teste' }))
      expect(onValueChange).toHaveBeenCalledTimes(1)
      expect(onValueChange).toHaveBeenCalledWith(custom[0]?.range)
      expect(screen.queryByRole('grid')).not.toBeInTheDocument()
      expect(button()).toHaveTextContent('12/10/2026 – 18/10/2026')
    })

    it('o atalho que bate com o período atual fica marcado com aria-pressed', async () => {
      render(<DateRangePicker aria-label="Período" presets={custom} defaultValue={range} />)
      await userEvent.click(button())
      expect(await screen.findByRole('button', { name: 'Semana de teste' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      expect(screen.getByRole('button', { name: 'Fim do mês' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })

    it('só com o início escolhido nenhum atalho fica marcado', async () => {
      render(
        <DateRangePicker
          aria-label="Período"
          presets={custom}
          defaultValue={{ from: new Date(2026, 9, 12) }}
        />,
      )
      await userEvent.click(button())
      expect(await screen.findByRole('button', { name: 'Semana de teste' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })

    it('atalhos fora de minDate e maxDate ficam desabilitados', async () => {
      render(
        <DateRangePicker
          aria-label="Período"
          presets={custom}
          minDate={new Date(2026, 9, 10)}
          maxDate={new Date(2026, 9, 20)}
        />,
      )
      await userEvent.click(button())
      expect(await screen.findByRole('button', { name: 'Semana de teste' })).toBeEnabled()
      expect(screen.getByRole('button', { name: 'Fim do mês' })).toBeDisabled()
    })

    it('com atalhos o painel perde o limite de largura padrão', async () => {
      render(<DateRangePicker aria-label="Período" presets={custom} />)
      await userEvent.click(button())
      expect(await screen.findByRole('dialog')).toHaveClass('iu:max-w-none')
    })

    it('funciona controlado: avisa mas só muda quando o valor chega', async () => {
      const onValueChange = vi.fn()
      render(
        <DateRangePicker
          aria-label="Período"
          presets={custom}
          value={range}
          onValueChange={onValueChange}
        />,
      )
      await userEvent.click(button())
      await userEvent.click(await screen.findByRole('button', { name: 'Fim do mês' }))
      expect(onValueChange).toHaveBeenCalledWith(custom[1]?.range)
      expect(button()).toHaveTextContent('12/10/2026 – 18/10/2026')
    })

    it('não tem violações de acessibilidade com os atalhos', async () => {
      render(<DateRangePicker aria-label="Período" presets defaultValue={range} />)
      await userEvent.click(button())
      expect(await axe(await screen.findByRole('dialog'))).toHaveNoViolations()
    })
  })
})
