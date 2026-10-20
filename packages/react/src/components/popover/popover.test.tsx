import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Popover, PopoverClose } from './popover'

beforeAll(() => {
  // jsdom não implementa; o Radix Popper usa para posicionar o painel.
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const trigger = <button type="button">Filtros</button>

describe('Popover', () => {
  it('começa fechado e abre ao clicar no trigger', async () => {
    render(
      <Popover trigger={trigger} label="Filtros">
        Conteúdo do painel
      </Popover>,
    )
    expect(screen.queryByText('Conteúdo do painel')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Filtros' }))
    expect(await screen.findByText('Conteúdo do painel')).toBeInTheDocument()
  })

  it('o trigger informa o estado aberto/fechado', async () => {
    render(
      <Popover trigger={trigger} label="Filtros">
        Painel
      </Popover>,
    )
    const button = screen.getByRole('button', { name: 'Filtros' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('Esc fecha e devolve o foco ao trigger', async () => {
    render(
      <Popover trigger={trigger} label="Filtros">
        Painel
      </Popover>,
    )
    const button = screen.getByRole('button', { name: 'Filtros' })
    await userEvent.click(button)
    await screen.findByText('Painel')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByText('Painel')).not.toBeInTheDocument()
    expect(button).toHaveFocus()
  })

  it('o PopoverClose dentro do conteúdo fecha o painel', async () => {
    render(
      <Popover defaultOpen trigger={trigger} label="Filtros">
        <PopoverClose asChild>
          <button type="button">Aplicar</button>
        </PopoverClose>
      </Popover>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(screen.queryByRole('button', { name: 'Aplicar' })).not.toBeInTheDocument()
  })

  it('funciona controlado e avisa as mudanças', async () => {
    const onOpenChange = vi.fn()
    render(
      <Popover open onOpenChange={onOpenChange} trigger={trigger} label="Filtros">
        Painel
      </Popover>,
    )
    expect(screen.getByText('Painel')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('o painel é um diálogo com o nome acessível de `label`', () => {
    render(
      <Popover defaultOpen trigger={trigger} label="Opções de filtro">
        Painel
      </Popover>,
    )
    expect(screen.getByRole('dialog', { name: 'Opções de filtro' })).toBeInTheDocument()
  })

  it('usa os tokens do DS e aceita className', () => {
    render(
      <Popover defaultOpen trigger={trigger} label="Filtros" className="iu:p-6">
        Painel
      </Popover>,
    )
    const panel = screen.getByText('Painel')
    expect(panel).toHaveClass('iu:bg-[var(--color-surface-elevated)]', 'iu:shadow-md', 'iu:p-6')
    expect(panel).not.toHaveClass('iu:p-4')
  })

  it('não tem violações de acessibilidade', async () => {
    const { baseElement } = render(
      <Popover defaultOpen trigger={trigger} label="Filtros">
        <p>Escolha os filtros</p>
      </Popover>,
    )
    expect(await axe(baseElement)).toHaveNoViolations()
  })
})
