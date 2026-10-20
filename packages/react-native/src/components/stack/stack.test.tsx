import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Stack } from './stack'

const cls = () => screen.getByTestId('s').props.className

describe('Stack', () => {
  it('renderiza filhos, em coluna com gap 4 por padrão', () => {
    render(
      <Stack testID="s">
        <Text>a</Text>
      </Stack>,
    )
    expect(screen.getByText('a')).toBeTruthy()
    expect(cls()).toContain('flex-col')
    expect(cls()).toContain('gap-4')
    expect(cls()).not.toContain('flex-wrap')
  })

  it('direction, gap, align, justify e wrap', () => {
    render(<Stack testID="s" direction="row" gap={2} align="center" justify="between" wrap />)
    for (const c of ['flex-row', 'gap-2', 'items-center', 'justify-between', 'flex-wrap']) {
      expect(cls()).toContain(c)
    }
    expect(cls()).not.toContain('gap-4')
  })

  it('className do consumidor vence', () => {
    render(<Stack testID="s" className="gap-10" />)
    expect(cls()).toContain('gap-10')
    expect(cls()).not.toContain('gap-4')
  })
})
