import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Drawer, DrawerClose } from './drawer'

const footer = (
  <>
    <DrawerClose asChild>
      <button type="button">Cancelar</button>
    </DrawerClose>
    <button type="button">Salvar</button>
  </>
)

describe('Drawer', () => {
  it('não mostra nada fechado, e abre pelo trigger', async () => {
    render(
      <Drawer title="Filtros" trigger={<button type="button">Abrir</button>}>
        Conteúdo
      </Drawer>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(await screen.findByRole('dialog', { name: 'Filtros' })).toBeInTheDocument()
  })

  it('mostra título, corpo e descrição acessível', () => {
    render(
      <Drawer open title="Filtros">
        Escolha os filtros.
      </Drawer>,
    )
    expect(screen.getByRole('dialog', { name: 'Filtros' })).toHaveAccessibleDescription(
      'Escolha os filtros.',
    )
  })

  it.each([
    ['right', 'iu:right-0', 'iu:border-l'],
    ['left', 'iu:left-0', 'iu:border-r'],
    ['top', 'iu:top-0', 'iu:border-b'],
    ['bottom', 'iu:bottom-0', 'iu:border-t'],
  ] as const)('side %s gruda na borda certa', (side, edge, border) => {
    render(
      <Drawer open title="T" side={side}>
        x
      </Drawer>,
    )
    expect(screen.getByRole('dialog')).toHaveClass(edge, border)
  })

  it('abre pela direita por padrão', () => {
    render(
      <Drawer open title="T">
        x
      </Drawer>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('iu:right-0')
  })

  it('o × fecha e o nome acessível dele é configurável', async () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer open onOpenChange={onOpenChange} title="T" closeLabel="Dispensar">
        x
      </Drawer>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Dispensar' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('Esc fecha o painel', async () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer open onOpenChange={onOpenChange} title="T">
        x
      </Drawer>,
    )
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renderiza o rodapé só com footer, e o DrawerClose fecha', async () => {
    const { rerender } = render(
      <Drawer defaultOpen title="T">
        x
      </Drawer>,
    )
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument()
    rerender(
      <Drawer defaultOpen title="T" footer={footer}>
        x
      </Drawer>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('prende o foco dentro do painel enquanto aberto', async () => {
    render(
      <>
        <button type="button">Fora</button>
        <Drawer open title="T" footer={footer}>
          x
        </Drawer>
      </>,
    )
    const dialog = screen.getByRole('dialog')
    for (let i = 0; i < 6; i++) {
      await userEvent.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
  })

  it('não tem violações de acessibilidade', async () => {
    render(
      <Drawer open title="Filtros" footer={footer}>
        Conteúdo
      </Drawer>,
    )
    expect(await axe(document.body)).toHaveNoViolations()
  })
})
