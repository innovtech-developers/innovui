import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Field } from '../field'
import { Modal } from '../modal'
import { Combobox, type ComboboxOption } from './combobox'

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const options: ComboboxOption[] = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais', disabled: true },
  { value: 'ba', label: 'Bahia' },
]

function setup(props: Partial<React.ComponentProps<typeof Combobox>> = {}) {
  return render(<Combobox aria-label="Estado" options={options} {...props} />)
}

describe('Combobox', () => {
  it('é um combobox fechado, com o texto da opção inicial', () => {
    setup({ defaultValue: 'rj' })
    const input = screen.getByRole('combobox', { name: 'Estado' })
    expect(input).toHaveValue('Rio de Janeiro')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('clicar no campo abre a lista com todas as opções', async () => {
    setup()
    await userEvent.click(screen.getByRole('combobox'))
    expect(await screen.findByRole('listbox', { name: 'Estado' })).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(4)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
  })

  it('digitar filtra, sem distinguir maiúsculas nem acentos', async () => {
    setup()
    await userEvent.type(screen.getByRole('combobox'), 'SAO')
    expect(await screen.findAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: 'São Paulo' })).toBeInTheDocument()
  })

  it('sem resultado mostra a mensagem, e ela é configurável', async () => {
    setup({ emptyMessage: 'Nada por aqui' })
    await userEvent.type(screen.getByRole('combobox'), 'zzz')
    expect(await screen.findByText('Nada por aqui')).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('setas movem a opção ativa (aria-activedescendant), pulando a desabilitada', async () => {
    setup()
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await screen.findByRole('listbox')
    const ids = () => input.getAttribute('aria-activedescendant')
    expect(document.getElementById(ids() as string)).toHaveTextContent('São Paulo')
    await userEvent.keyboard('{ArrowDown}')
    expect(document.getElementById(ids() as string)).toHaveTextContent('Rio de Janeiro')
    await userEvent.keyboard('{ArrowDown}')
    expect(document.getElementById(ids() as string)).toHaveTextContent('Bahia')
    await userEvent.keyboard('{ArrowDown}')
    expect(document.getElementById(ids() as string)).toHaveTextContent('São Paulo')
    await userEvent.keyboard('{ArrowUp}')
    expect(document.getElementById(ids() as string)).toHaveTextContent('Bahia')
  })

  it('ArrowDown abre a lista quando fechada', async () => {
    setup()
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    expect(await screen.findByRole('listbox')).toBeInTheDocument()
  })

  it('Enter escolhe a opção ativa, chama onValueChange e fecha', async () => {
    const onValueChange = vi.fn()
    setup({ onValueChange })
    await userEvent.type(screen.getByRole('combobox'), 'rio{Enter}')
    expect(onValueChange).toHaveBeenCalledWith('rj')
    expect(screen.getByRole('combobox')).toHaveValue('Rio de Janeiro')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('clicar numa opção escolhe e mantém o foco no campo', async () => {
    const onValueChange = vi.fn()
    setup({ onValueChange })
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByRole('option', { name: 'Bahia' }))
    expect(onValueChange).toHaveBeenCalledWith('ba')
    expect(screen.getByRole('combobox')).toHaveValue('Bahia')
    expect(screen.getByRole('combobox')).toHaveFocus()
  })

  it('opção desabilitada não pode ser escolhida', async () => {
    const onValueChange = vi.fn()
    setup({ onValueChange })
    await userEvent.click(screen.getByRole('combobox'))
    const minas = await screen.findByRole('option', { name: 'Minas Gerais' })
    expect(minas).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(minas)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('a opção escolhida fica marcada com aria-selected', async () => {
    setup({ defaultValue: 'ba' })
    await userEvent.click(screen.getByRole('combobox'))
    expect(await screen.findByRole('option', { name: 'Bahia' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('option', { name: 'São Paulo' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })

  it('Esc fecha e descarta o texto digitado', async () => {
    setup({ defaultValue: 'sp' })
    const input = screen.getByRole('combobox')
    await userEvent.clear(input)
    await userEvent.type(input, 'ba')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('sair do campo volta ao texto da opção escolhida', async () => {
    render(
      <>
        <Combobox aria-label="Estado" options={options} defaultValue="sp" />
        <button type="button">Outro</button>
      </>,
    )
    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'x')
    await userEvent.click(screen.getByRole('button', { name: 'Outro' }))
    expect(input).toHaveValue('São Paulo')
  })

  it('apagar o texto limpa a seleção', async () => {
    const onValueChange = vi.fn()
    setup({ defaultValue: 'sp', onValueChange })
    await userEvent.clear(screen.getByRole('combobox'))
    expect(onValueChange).toHaveBeenCalledWith('')
  })

  it('funciona controlado: o valor vem de fora', async () => {
    const onValueChange = vi.fn()
    const { rerender } = setup({ value: 'rj', onValueChange })
    expect(screen.getByRole('combobox')).toHaveValue('Rio de Janeiro')
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByRole('option', { name: 'Bahia' }))
    expect(onValueChange).toHaveBeenCalledWith('ba')
    expect(screen.getByRole('combobox')).toHaveValue('Rio de Janeiro')
    rerender(<Combobox aria-label="Estado" options={options} value="ba" />)
    expect(screen.getByRole('combobox')).toHaveValue('Bahia')
  })

  it('name envia o valor num campo oculto', () => {
    const { container } = setup({ name: 'estado', defaultValue: 'mg' })
    expect(container.querySelector('input[type="hidden"]')).toHaveAttribute('name', 'estado')
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('mg')
  })

  it('desabilitado e somente leitura não abrem', async () => {
    const { rerender } = setup({ disabled: true })
    expect(screen.getByRole('combobox')).toBeDisabled()
    rerender(<Combobox aria-label="Estado" options={options} readOnly />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('error marca aria-invalid e repassa onKeyDown/onBlur do usuário', async () => {
    const onKeyDown = vi.fn()
    const onBlur = vi.fn()
    setup({ error: true, onKeyDown, onBlur })
    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    await userEvent.type(input, 'a')
    expect(onKeyDown).toHaveBeenCalled()
    await userEvent.tab()
    expect(onBlur).toHaveBeenCalled()
  })

  it('funciona dentro de um Field, que dá o nome pelo rótulo', () => {
    render(
      <Field label="Estado" supportingText="Onde você mora">
        <Combobox options={options} />
      </Field>,
    )
    const input = screen.getByRole('combobox', { name: 'Estado' })
    expect(input).toHaveAccessibleDescription('Onde você mora')
  })

  it('clicar no próprio campo com a lista aberta não a fecha', async () => {
    setup()
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await screen.findByRole('listbox')
    await userEvent.click(input)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('funciona dentro de um Modal: escolher uma opção não fecha o diálogo', async () => {
    const onValueChange = vi.fn()
    render(
      <Modal open title="Endereço">
        <Combobox aria-label="Estado" options={options} onValueChange={onValueChange} />
      </Modal>,
    )
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByRole('option', { name: 'Bahia' }))
    expect(onValueChange).toHaveBeenCalledWith('ba')
    expect(screen.getByRole('dialog', { name: 'Endereço' })).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('Bahia')
  })

  it('Esc dentro de um Modal fecha só a lista, não o diálogo', async () => {
    render(
      <Modal open title="Endereço">
        <Combobox aria-label="Estado" options={options} />
      </Modal>,
    )
    await userEvent.click(screen.getByRole('combobox'))
    await screen.findByRole('listbox')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Endereço' })).toBeInTheDocument()
  })

  it('com todas as opções desabilitadas, as setas não ativam nenhuma', async () => {
    render(
      <Combobox
        aria-label="Estado"
        options={[
          { value: 'a', label: 'A', disabled: true },
          { value: 'b', label: 'B', disabled: true },
        ]}
      />,
    )
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}')
    expect(input).not.toHaveAttribute('aria-activedescendant')
  })

  it('não tem violações de acessibilidade, fechado e aberto', async () => {
    const { container } = setup()
    expect(await axe(container)).toHaveNoViolations()
    await userEvent.click(screen.getByRole('combobox'))
    await screen.findByRole('listbox')
    expect(await axe(screen.getByRole('listbox'))).toHaveNoViolations()
  })
})
