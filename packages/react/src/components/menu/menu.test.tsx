import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Menu, MenuItem, MenuLabel, MenuSeparator } from './menu'

beforeAll(() => {
  // jsdom não implementa estas APIs, que o Radix Menu usa para posicionar e navegar.
  window.HTMLElement.prototype.hasPointerCapture = vi.fn()
  window.HTMLElement.prototype.releasePointerCapture = vi.fn()
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

function renderMenu(onEdit = vi.fn(), props: Partial<React.ComponentProps<typeof Menu>> = {}) {
  return render(
    <Menu trigger={<button type="button">Ações</button>} {...props}>
      <MenuLabel>Item</MenuLabel>
      <MenuItem onSelect={onEdit}>Editar</MenuItem>
      <MenuItem disabled>Duplicar</MenuItem>
      <MenuSeparator />
      <MenuItem destructive>Excluir</MenuItem>
    </Menu>,
  )
}

describe('Menu', () => {
  it('começa fechado e abre pelo teclado (Enter no trigger)', async () => {
    renderMenu()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
  })

  it('abre pelo clique e anuncia o estado no trigger', async () => {
    renderMenu()
    const trigger = screen.getByRole('button', { name: 'Ações' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    await userEvent.click(trigger)
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('escolher um item chama onSelect e fecha o menu', async () => {
    const onEdit = vi.fn()
    renderMenu(onEdit)
    await userEvent.click(screen.getByRole('button', { name: 'Ações' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Editar' }))
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('setas navegam e Enter escolhe', async () => {
    const onEdit = vi.fn()
    renderMenu(onEdit)
    await userEvent.click(screen.getByRole('button', { name: 'Ações' }))
    await screen.findByRole('menu')
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('item desabilitado não dispara e fica marcado', async () => {
    const onSelect = vi.fn()
    render(
      <Menu defaultOpen trigger={<button type="button">Ações</button>}>
        <MenuItem disabled onSelect={onSelect}>
          Duplicar
        </MenuItem>
      </Menu>,
    )
    const item = screen.getByRole('menuitem', { name: 'Duplicar' })
    expect(item).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(item)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('Esc fecha o menu', async () => {
    renderMenu()
    await userEvent.click(screen.getByRole('button', { name: 'Ações' }))
    await screen.findByRole('menu')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('destructive usa a cor de erro; o padrão usa text/primary', () => {
    renderMenu(vi.fn(), { defaultOpen: true })
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveClass(
      'iu:text-[var(--color-status-error-text)]',
    )
    expect(screen.getByRole('menuitem', { name: 'Editar' })).toHaveClass(
      'iu:text-[var(--color-text-primary)]',
    )
  })

  it('mostra o ícone antes do rótulo', () => {
    render(
      <Menu defaultOpen trigger={<button type="button">Ações</button>}>
        <MenuItem icon={<svg data-testid="ic" />}>Editar</MenuItem>
      </Menu>,
    )
    expect(screen.getByRole('menuitem', { name: 'Editar' })).toContainElement(
      screen.getByTestId('ic'),
    )
  })

  it('className chega ao conteúdo', () => {
    renderMenu(vi.fn(), { defaultOpen: true, className: 'iu:min-w-[240px]' })
    expect(screen.getByRole('menu')).toHaveClass('iu:min-w-[240px]')
  })

  it('não tem violações de acessibilidade', async () => {
    renderMenu(vi.fn(), { defaultOpen: true })
    expect(await axe(screen.getByRole('menu'))).toHaveNoViolations()
  })
})
