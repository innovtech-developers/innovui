import { act, render, screen } from '@testing-library/react-native'
import { StyleSheet, Text, type ViewStyle } from 'react-native'
import { AnchoredOverlay } from './anchored-overlay'
import { Backdrop } from './backdrop'
import { CheckIcon, StatusIcon } from './status'
import { useToken } from './use-token'

function Token() {
  return <Text>{String(useToken('--color-text-primary'))}</Text>
}

describe('_shared', () => {
  it('renderiza ícones SVG', () => {
    render(
      <>
        <StatusIcon status="success" color="#000" />
        <CheckIcon color="#000" />
      </>,
    )
  })

  it('renderiza o backdrop e o overlay ancorado', () => {
    render(
      <>
        <Backdrop testID="bd" />
        <AnchoredOverlay
          visible
          rect={{ x: 10, y: 10, width: 100, height: 40 }}
          onRequestClose={() => {}}
        >
          <Text>conteúdo</Text>
        </AnchoredOverlay>
      </>,
    )
    expect(screen.getByTestId('bd')).toBeTruthy()
    expect(screen.getByText('conteúdo')).toBeTruthy()
  })

  it('useToken não quebra fora do Metro', () => {
    render(<Token />)
    expect(screen.getByText(/.+/)).toBeTruthy()
  })

  describe('AnchoredOverlay: entrada e saída', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => jest.useRealTimers())
    const rect = { x: 10, y: 20, width: 80, height: 40 }
    const overlay = (visible: boolean) => (
      <AnchoredOverlay visible={visible} rect={rect} onRequestClose={() => {}}>
        <Text>conteúdo</Text>
      </AnchoredOverlay>
    )

    it('fica montado durante a saída e some depois dela', () => {
      const { rerender } = render(overlay(true))
      act(() => jest.advanceTimersByTime(400))
      rerender(overlay(false))
      expect(screen.getByText('conteúdo')).toBeTruthy()
      act(() => jest.advanceTimersByTime(400))
      expect(screen.queryByText('conteúdo')).toBeNull()
    })

    it('começa menor (zoom de 96%) e transparente, a partir do gatilho', () => {
      const { rerender } = render(overlay(false))
      rerender(overlay(true))
      const wrapper = screen.UNSAFE_root.findAll((node: { props: { style?: unknown } }) =>
        Boolean(
          node.props.style && StyleSheet.flatten(node.props.style as ViewStyle).transformOrigin,
        ),
      ).at(-1) // o `View` nativo, com os valores já resolvidos
      const style = StyleSheet.flatten(wrapper?.props.style)
      expect(style.opacity).toBe(0)
      expect(style.transform[0].scale).toBeCloseTo(0.96)
      expect(style.transformOrigin).toBe('top left')
    })
  })
})
