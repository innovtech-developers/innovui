import { fireEvent, render, screen } from '@testing-library/react-native'
import { StyleSheet, useWindowDimensions } from 'react-native'
import { Grid, GridItem } from './grid'

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 390, height: 800, scale: 1, fontScale: 1 })),
}))

const mockWidth = (width: number) =>
  jest.mocked(useWindowDimensions).mockReturnValue({ width, height: 800, scale: 1, fontScale: 1 })
const style = (id: string) => StyleSheet.flatten(screen.getByTestId(id).props.style)
const layout = (width: number) => ({ nativeEvent: { layout: { width, height: 0, x: 0, y: 0 } } })

describe('Grid', () => {
  beforeEach(() => mockWidth(390))

  it('usa flex-wrap e gap 16px por padrão; className vence', () => {
    render(<Grid testID="g" className="p-2" />)
    expect(screen.getByTestId('g').props.className).toContain('flex-wrap')
    expect(screen.getByTestId('g').props.className).toContain('p-2')
    expect(style('g').gap).toBe(16)
  })

  it('antes da medição, usa porcentagem (responsive: 4 colunas no mobile)', () => {
    render(
      <Grid>
        <GridItem testID="i" span={2} />
      </Grid>,
    )
    expect(style('i').width).toBe('50%')
  })

  it.each([
    [390, 4],
    [768, 8],
    [1440, 12],
  ])('responsive em janela de %ipx tem %i colunas', (w, cols) => {
    mockWidth(w)
    render(
      <Grid>
        <GridItem testID="i" />
      </Grid>,
    )
    expect(parseFloat(style('i').width as string)).toBeCloseTo(100 / cols)
  })

  it('calcula a largura da célula descontando o gap depois do layout', () => {
    render(
      <Grid testID="g" columns={4} gap={4}>
        <GridItem testID="a" />
        <GridItem testID="b" span={2} />
        <GridItem testID="c" span="full" />
      </Grid>,
    )
    fireEvent(screen.getByTestId('g'), 'layout', layout(364))
    // (364 - 3*16) / 4 = 79
    expect(style('a').width).toBe(79)
    expect(style('b').width).toBe(79 * 2 + 16)
    expect(style('c').width).toBe(364)
  })

  it('span maior que as colunas é limitado', () => {
    render(
      <Grid testID="g" columns={2} gap={0}>
        <GridItem testID="i" span={12} />
      </Grid>,
    )
    fireEvent(screen.getByTestId('g'), 'layout', layout(200))
    expect(style('i').width).toBe(200)
  })

  it('repassa onLayout do consumidor', () => {
    const onLayout = jest.fn()
    render(<Grid testID="g" onLayout={onLayout} />)
    fireEvent(screen.getByTestId('g'), 'layout', layout(100))
    expect(onLayout).toHaveBeenCalledTimes(1)
  })
})
