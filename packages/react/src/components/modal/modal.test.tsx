import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Modal, ModalClose } from './modal'

const footer = (
  <>
    <ModalClose asChild>
      <button type="button">Cancelar</button>
    </ModalClose>
    <button type="button">Confirmar</button>
  </>
)

describe('Modal', () => {
  it('não mostra nada fechado, e abre pelo trigger', async () => {
    render(
      <Modal title="Excluir item" trigger={<button type="button">Abrir</button>}>
        Esta ação não pode ser desfeita.
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(await screen.findByRole('dialog', { name: 'Excluir item' })).toBeInTheDocument()
  })

  it('mostra título, corpo e descrição acessível', () => {
    render(
      <Modal open title="Excluir item">
        Esta ação não pode ser desfeita.
      </Modal>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Excluir item' })
    expect(dialog).toHaveAccessibleDescription('Esta ação não pode ser desfeita.')
  })

  it('renderiza o rodapé só quando há footer', () => {
    const { rerender } = render(
      <Modal open title="T">
        Corpo
      </Modal>,
    )
    expect(screen.queryByRole('button', { name: 'Confirmar' })).not.toBeInTheDocument()
    rerender(
      <Modal open title="T" footer={footer}>
        Corpo
      </Modal>,
    )
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument()
  })

  it('o botão de fechar do cabeçalho fecha o modal', async () => {
    const onOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={onOpenChange} title="T">
        Corpo
      </Modal>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('esconde o × com showClose={false} e troca o nome acessível dele', () => {
    const { rerender } = render(
      <Modal open title="T" showClose={false}>
        Corpo
      </Modal>,
    )
    expect(screen.queryByRole('button', { name: 'Fechar' })).not.toBeInTheDocument()
    rerender(
      <Modal open title="T" closeLabel="Dispensar">
        Corpo
      </Modal>,
    )
    expect(screen.getByRole('button', { name: 'Dispensar' })).toBeInTheDocument()
  })

  it('Esc fecha o modal', async () => {
    const onOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={onOpenChange} title="T">
        Corpo
      </Modal>,
    )
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('o ModalClose do rodapé fecha o modal', async () => {
    render(
      <Modal defaultOpen title="T" footer={footer}>
        Corpo
      </Modal>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('prende o foco dentro do modal enquanto aberto', async () => {
    render(
      <>
        <button type="button">Fora</button>
        <Modal open title="T" footer={footer}>
          Corpo
        </Modal>
      </>,
    )
    const dialog = screen.getByRole('dialog')
    for (let i = 0; i < 6; i++) {
      await userEvent.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
  })

  it.each([
    ['sm', 'iu:max-w-[480px]'],
    ['md', 'iu:max-w-[640px]'],
    ['lg', 'iu:max-w-[800px]'],
  ] as const)('o tamanho %s limita a largura', (size, width) => {
    render(
      <Modal open title="T" size={size}>
        Corpo
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toHaveClass(width)
  })

  it('usa o visual do Figma e o backdrop escurece o fundo', () => {
    render(
      <Modal open title="T" className="iu:mt-2">
        Corpo
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('iu:rounded-lg', 'iu:shadow-2xl', 'iu:mt-2')
    expect(
      document.querySelector('[data-state="open"].iu\\:opacity-\\(--surface-overlay-opacity\\)'),
    ).toHaveClass('iu:bg-[var(--color-surface-overlay)]')
  })

  it('não tem violações de acessibilidade', async () => {
    render(
      <Modal open title="Excluir item" footer={footer}>
        Esta ação não pode ser desfeita.
      </Modal>,
    )
    expect(await axe(document.body)).toHaveNoViolations()
  })
})
