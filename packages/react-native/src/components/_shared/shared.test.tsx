import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
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
})
