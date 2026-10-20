import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { StyleSheet } from 'react-native'
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

  describe('indicador deslizante', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => jest.useRealTimers())

    const measure = (name: string, x: number, width: number) =>
      fireEvent(radio(name), 'layout', {
        nativeEvent: { layout: { x, y: 4, width, height: 36 } },
      })
    const indicator = () =>
      StyleSheet.flatten(screen.UNSAFE_getAllByProps({ pointerEvents: 'none' }).at(-1)?.props.style)

    it('antes de medir, o item marcado desenha o próprio fundo e não há pill', () => {
      render(<Example />)
      expect(screen.UNSAFE_queryAllByProps({ pointerEvents: 'none' })).toHaveLength(0)
      expect(radio('Lista').props.className).toContain('bg-surface-primary')
    })

    it('depois de medir, o pill assume o fundo e o item deixa de desenhá-lo', () => {
      render(<Example />)
      measure('Lista', 4, 60)
      measure('Grade', 68, 70)
      expect(indicator()).toMatchObject({ left: 4, top: 4, width: 60, height: 36 })
      expect(radio('Lista').props.className).not.toContain('bg-surface-primary')
    })

    it('ao escolher outro item, o pill desliza e se redimensiona até ele', () => {
      render(<Example />)
      measure('Lista', 4, 60)
      measure('Grade', 68, 70)
      fireEvent.press(radio('Grade'))
      act(() => jest.advanceTimersByTime(100))
      const mid = indicator()
      expect(mid.left).toBeGreaterThan(4)
      expect(mid.left).toBeLessThan(68)
      act(() => jest.advanceTimersByTime(300))
      expect(indicator()).toMatchObject({ left: 68, top: 4, width: 70, height: 36 })
    })
  })
})
