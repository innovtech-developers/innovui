import { fireEvent, render, screen } from '@testing-library/react-native'
import { SegmentedControl, SegmentedItem } from './segmented-control'

function Example({ onValueChange }: { onValueChange?: (value: string) => void }) {
  return (
    <SegmentedControl
      accessibilityLabel="Visualização"
      defaultValue="lista"
      onValueChange={onValueChange}
    >
      <SegmentedItem value="lista">Lista</SegmentedItem>
      <SegmentedItem value="grade">Grade</SegmentedItem>
      <SegmentedItem value="mapa" disabled>
        Mapa
      </SegmentedItem>
    </SegmentedControl>
  )
}

const radio = (name: string) => screen.getByRole('radio', { name })

describe('SegmentedControl', () => {
  it('é um radiogroup nomeado, com o item padrão marcado', () => {
    render(<Example />)
    // O grupo não é `accessible` (senão engoliria os itens), então sai por label, não por role.
    expect(screen.getByLabelText('Visualização').props.accessibilityRole).toBe('radiogroup')
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(radio('Lista')).toBeChecked()
  })

  it('troca o item ao tocar e avisa onValueChange', () => {
    const onValueChange = jest.fn()
    render(<Example onValueChange={onValueChange} />)
    fireEvent.press(radio('Grade'))
    expect(onValueChange).toHaveBeenCalledWith('grade')
    expect(radio('Grade')).toBeChecked()
    expect(radio('Lista')).not.toBeChecked()
  })

  it('tocar no item já marcado não avisa nem desmarca', () => {
    const onValueChange = jest.fn()
    render(<Example onValueChange={onValueChange} />)
    fireEvent.press(radio('Lista'))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(radio('Lista')).toBeChecked()
  })

  it('o item desabilitado não é marcado', () => {
    render(<Example />)
    expect(radio('Mapa')).toBeDisabled()
    fireEvent.press(radio('Mapa'))
    expect(radio('Lista')).toBeChecked()
  })

  it('funciona controlado', () => {
    const { rerender } = render(
      <SegmentedControl accessibilityLabel="x" value="a">
        <SegmentedItem value="a">A</SegmentedItem>
        <SegmentedItem value="b">B</SegmentedItem>
      </SegmentedControl>,
    )
    fireEvent.press(radio('B'))
    expect(radio('A')).toBeChecked()
    rerender(
      <SegmentedControl accessibilityLabel="x" value="b">
        <SegmentedItem value="a">A</SegmentedItem>
        <SegmentedItem value="b">B</SegmentedItem>
      </SegmentedControl>,
    )
    expect(radio('B')).toBeChecked()
  })

  it('o item marcado ganha fundo de superfície com sombra', () => {
    render(<Example />)
    expect(radio('Lista').props.className).toContain('bg-surface-primary')
    expect(radio('Lista').props.className).toContain('shadow-sm')
    expect(radio('Grade').props.className).not.toContain('bg-surface-primary')
    expect(screen.getByText('Lista').props.className).toContain('text-text-primary')
    expect(screen.getByText('Grade').props.className).toContain('text-text-secondary')
  })

  it('mescla className no grupo e no item', () => {
    render(
      <SegmentedControl accessibilityLabel="x" className="mt-4">
        <SegmentedItem value="a" className="ml-2">
          A
        </SegmentedItem>
      </SegmentedControl>,
    )
    expect(screen.getByLabelText('x').props.className).toContain('mt-4')
    expect(radio('A').props.className).toContain('ml-2')
  })
})
