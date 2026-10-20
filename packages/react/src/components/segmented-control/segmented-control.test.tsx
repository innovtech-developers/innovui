import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { SegmentedControl, SegmentedItem } from './segmented-control'

function Example({ onValueChange }: { onValueChange?: (value: string) => void }) {
  return (
    <SegmentedControl aria-label="Visualização" defaultValue="lista" onValueChange={onValueChange}>
      <SegmentedItem value="lista">Lista</SegmentedItem>
      <SegmentedItem value="grade">Grade</SegmentedItem>
      <SegmentedItem value="mapa" disabled>
        Mapa
      </SegmentedItem>
    </SegmentedControl>
  )
}

describe('SegmentedControl', () => {
  it('é um radiogroup nomeado, com o item padrão marcado', () => {
    render(<Example />)
    expect(screen.getByRole('radiogroup', { name: 'Visualização' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('radio', { name: 'Lista' })).toBeChecked()
  })

  it('troca o item ao clicar e avisa onValueChange', async () => {
    const onValueChange = vi.fn()
    render(<Example onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Grade' }))
    expect(onValueChange).toHaveBeenCalledWith('grade')
    expect(screen.getByRole('radio', { name: 'Grade' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Lista' })).not.toBeChecked()
  })

  it('clicar no item já marcado não desmarca', async () => {
    render(<Example />)
    await userEvent.click(screen.getByRole('radio', { name: 'Lista' }))
    expect(screen.getByRole('radio', { name: 'Lista' })).toBeChecked()
  })

  it('navega com as setas, pulando o item desabilitado', async () => {
    render(<Example />)
    await userEvent.click(screen.getByRole('radio', { name: 'Lista' }))
    // O Radix marca o item quando o foco chega com a seta ainda pressionada; por isso a seta é
    // segurada (`>`) e só solta depois, como acontece num teclado de verdade.
    await userEvent.keyboard('{ArrowRight>}')
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Grade' })).toBeChecked())
    await userEvent.keyboard('{/ArrowRight}{ArrowRight>}')
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Lista' })).toBeChecked())
    await userEvent.keyboard('{/ArrowRight}')
  })

  it('o item desabilitado não é marcado', async () => {
    render(<Example />)
    expect(screen.getByRole('radio', { name: 'Mapa' })).toBeDisabled()
    await userEvent.click(screen.getByRole('radio', { name: 'Mapa' }))
    expect(screen.getByRole('radio', { name: 'Lista' })).toBeChecked()
  })

  it('o item marcado ganha fundo de superfície com sombra (estilo iOS)', () => {
    render(<Example />)
    const checked = screen.getByRole('radio', { name: 'Lista' })
    expect(checked).toHaveClass(
      'iu:data-[state=checked]:bg-[var(--color-surface-primary)]',
      'iu:data-[state=checked]:shadow-sm',
    )
    expect(checked.className).not.toContain('bg-[var(--color-bg-primary)]')
  })

  it('o fundo do item marcado é um indicador único no grupo, que assume o desenho do item depois de medir', () => {
    render(<Example />)
    const group = screen.getByRole('radiogroup')
    expect(group).toHaveAttribute('data-slide')
    const indicator = group.querySelector(':scope > span[aria-hidden="true"]')
    expect(indicator).toHaveClass('iu:absolute', 'iu:bg-[var(--color-surface-primary)]')
    expect(within(group).getAllByRole('radio')).toHaveLength(3)
  })

  it('o hover escurece o texto dos itens inativos habilitados, sem afetar o marcado', () => {
    render(<Example />)
    const hover = 'iu:data-[state=unchecked]:enabled:hover:text-[var(--color-text-primary)]'
    expect(screen.getByRole('radio', { name: 'Grade' })).toHaveClass(hover)
    expect(screen.getByRole('radio', { name: 'Grade' })).toHaveAttribute('data-state', 'unchecked')
    expect(screen.getByRole('radio', { name: 'Lista' })).toHaveAttribute('data-state', 'checked')
  })

  it('mescla className e repassa props HTML', () => {
    render(
      <SegmentedControl aria-label="x" className="iu:mt-4" data-testid="c">
        <SegmentedItem value="a" className="iu:ml-2">
          A
        </SegmentedItem>
      </SegmentedControl>,
    )
    expect(screen.getByTestId('c')).toHaveClass('iu:mt-4', 'iu:rounded-md')
    expect(screen.getByRole('radio')).toHaveClass('iu:ml-2')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Example />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
