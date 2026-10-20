import { render, screen } from '@testing-library/react-native'
import { useWindowDimensions } from 'react-native'
import { Container } from './container'

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 390, height: 800, scale: 1, fontScale: 1 })),
}))

const mockWidth = (width: number) =>
  jest.mocked(useWindowDimensions).mockReturnValue({ width, height: 800, scale: 1, fontScale: 1 })
const cls = () => screen.getByTestId('c').props.className

describe('Container', () => {
  it('lg e margem de 16px no mobile por padrão', () => {
    mockWidth(390)
    render(<Container testID="c" />)
    expect(cls()).toContain('max-w-[1200px]')
    expect(cls()).toContain('px-4')
    expect(cls()).toContain('mx-auto')
  })

  it('margem de 24px a partir de 768px', () => {
    mockWidth(768)
    render(<Container testID="c" />)
    expect(cls()).toContain('px-6')
    expect(cls()).not.toContain('px-4')
  })

  it.each([
    ['sm', 'max-w-[640px]'],
    ['md', 'max-w-[960px]'],
    ['xl', 'max-w-[1440px]'],
  ] as const)('size %s', (size, expected) => {
    mockWidth(390)
    render(<Container testID="c" size={size} />)
    expect(cls()).toContain(expected)
    expect(cls()).not.toContain('max-w-[1200px]')
  })

  it('className do consumidor vence', () => {
    mockWidth(390)
    render(<Container testID="c" className="px-0" />)
    expect(cls()).toContain('px-0')
    expect(cls()).not.toContain('px-4')
  })
})
