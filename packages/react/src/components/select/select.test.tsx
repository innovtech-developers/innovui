import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Select, SelectOption } from './select'

// jsdom não implementa estas APIs, mas o Radix Select depende delas para posicionar e
// rolar o dropdown — sem os stubs, abrir o Select lança erro em qualquer teste.
beforeAll(() => {
  window.HTMLElement.prototype.hasPointerCapture = vi.fn()
  window.HTMLElement.prototype.releasePointerCapture = vi.fn()
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

function renderSelect(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  return render(
    <Select aria-label="Workspace" {...props}>
      <SelectOption value="ops">Operações</SelectOption>
      <SelectOption value="mkt">Marketing</SelectOption>
      <SelectOption value="fin" disabled>
        Financeiro
      </SelectOption>
    </Select>,
  )
}

describe('Select', () => {
  it('renderiza com placeholder', () => {
    renderSelect({ placeholder: 'Escolha um workspace' })
    expect(screen.getByText('Escolha um workspace')).toBeInTheDocument()
  })

  it('abre o dropdown e seleciona uma opção', async () => {
    const onValueChange = vi.fn()
    renderSelect({ onValueChange })
    await userEvent.click(screen.getByRole('combobox'))
    const option = await screen.findByRole('option', { name: 'Operações' })
    await userEvent.click(option)
    expect(onValueChange).toHaveBeenCalledWith('ops')
  })

  it('exibe o valor selecionado (controlado)', () => {
    renderSelect({ value: 'mkt' })
    expect(screen.getByText('Marketing')).toBeInTheDocument()
  })

  it('fica desabilitado via a prop disabled', () => {
    renderSelect({ disabled: true })
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('marca aria-invalid quando error está ativo', () => {
    renderSelect({ error: true })
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('readOnly nunca abre o dropdown', async () => {
    renderSelect({ readOnly: true })
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('readOnly continua focável (diferente de disabled)', () => {
    renderSelect({ readOnly: true })
    expect(screen.getByRole('combobox')).not.toBeDisabled()
  })

  it('mescla className customizada', () => {
    renderSelect({ className: 'iu:mt-4' })
    expect(screen.getByRole('combobox')).toHaveClass('iu:mt-4')
  })

  it.each(['lg', 'md', 'sm'] as const)('renderiza o tamanho %s', (size) => {
    renderSelect({ size })
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderSelect()
    expect(await axe(container)).toHaveNoViolations()
  })
})
