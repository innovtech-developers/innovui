import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Field } from '../field'
import { DatePicker } from './date-picker'

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const oct19 = new Date(2026, 9, 19)

describe('DatePicker', () => {
  it('sem data mostra o placeholder', () => {
    render(<DatePicker aria-label="Entrega" />)
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveTextContent('dd/mm/aaaa')
  })

  it('o placeholder é configurável', () => {
    render(<DatePicker aria-label="Entrega" placeholder="Escolha o dia" />)
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveTextContent('Escolha o dia')
  })

  it('com data mostra dd/mm/aaaa', () => {
    render(<DatePicker aria-label="Entrega" defaultValue={oct19} />)
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveTextContent('19/10/2026')
  })

  it('o locale muda o formato', () => {
    render(<DatePicker aria-label="Entrega" defaultValue={oct19} locale="en-US" />)
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveTextContent('10/19/2026')
  })

  it('abre o calendário no mês da data e foca o dia escolhido', async () => {
    render(<DatePicker aria-label="Entrega" defaultValue={oct19} />)
    await userEvent.click(screen.getByRole('button', { name: 'Entrega' }))
    expect(await screen.findByRole('grid', { name: /outubro de 2026/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /19 de outubro/ })).toHaveFocus()
  })

  it('escolher um dia atualiza o texto, avisa e fecha o calendário', async () => {
    const onValueChange = vi.fn()
    render(<DatePicker aria-label="Entrega" defaultValue={oct19} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Entrega' }))
    await userEvent.click(await screen.findByRole('button', { name: /22 de outubro/ }))
    expect(onValueChange.mock.calls[0]?.[0]).toEqual(new Date(2026, 9, 22))
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveTextContent('22/10/2026')
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
  })

  it('funciona controlado', async () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <DatePicker aria-label="Entrega" value={oct19} onValueChange={onValueChange} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Entrega' }))
    await userEvent.click(await screen.findByRole('button', { name: /22 de outubro/ }))
    expect(onValueChange).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveTextContent('19/10/2026')
    rerender(<DatePicker aria-label="Entrega" value={new Date(2026, 9, 22)} />)
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveTextContent('22/10/2026')
  })

  it('Esc fecha o calendário e devolve o foco ao botão', async () => {
    render(<DatePicker aria-label="Entrega" defaultValue={oct19} />)
    const trigger = screen.getByRole('button', { name: 'Entrega' })
    await userEvent.click(trigger)
    await screen.findByRole('grid')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('minDate e maxDate chegam ao calendário', async () => {
    render(<DatePicker aria-label="Entrega" defaultValue={oct19} minDate={oct19} />)
    await userEvent.click(screen.getByRole('button', { name: 'Entrega' }))
    expect(await screen.findByRole('button', { name: /18 de outubro/ })).toBeDisabled()
  })

  it('name envia aaaa-mm-dd num campo oculto', () => {
    const first = render(<DatePicker aria-label="Entrega" name="entrega" defaultValue={oct19} />)
    expect(first.container.querySelector('input[type="hidden"]')).toHaveValue('2026-10-19')
    first.unmount()
    const second = render(<DatePicker aria-label="Entrega" name="entrega" />)
    expect(second.container.querySelector('input[type="hidden"]')).toHaveValue('')
  })

  it('desabilitado não abre; somente leitura mostra a data mas não abre', async () => {
    const disabled = render(<DatePicker aria-label="Entrega" disabled />)
    expect(screen.getByRole('button', { name: 'Entrega' })).toBeDisabled()
    disabled.unmount()
    render(<DatePicker aria-label="Entrega" readOnly defaultValue={oct19} />)
    await userEvent.click(screen.getByRole('button', { name: 'Entrega' }))
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveTextContent('19/10/2026')
  })

  it('error marca aria-invalid', () => {
    render(<DatePicker aria-label="Entrega" error />)
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('funciona dentro de um Field, que dá o nome pelo rótulo', () => {
    render(
      <Field label="Data de entrega" supportingText="Dias úteis">
        <DatePicker />
      </Field>,
    )
    const button = screen.getByRole('button', { name: /Data de entrega/ })
    expect(button).toHaveAccessibleDescription('Dias úteis')
  })

  it('size e className chegam ao botão', () => {
    render(<DatePicker aria-label="Entrega" size="sm" className="iu:max-w-xs" />)
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveClass('iu:h-10', 'iu:max-w-xs')
  })

  it('não tem violações de acessibilidade, fechado e aberto', async () => {
    const { container } = render(<DatePicker aria-label="Entrega" defaultValue={oct19} />)
    expect(await axe(container)).toHaveNoViolations()
    await userEvent.click(screen.getByRole('button', { name: 'Entrega' }))
    expect(await axe(await screen.findByRole('dialog'))).toHaveNoViolations()
  })
})
