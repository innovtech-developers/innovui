import { fireEvent, render, screen } from '@testing-library/react-native'
import { Linking } from 'react-native'
import { Link } from './link'

describe('Link', () => {
  beforeEach(() => {
    jest.mocked(Linking.openURL).mockReset().mockResolvedValue(true)
  })

  it('tem role link, sublinhado e a cor da marca', () => {
    render(<Link href="https://x.test">Docs</Link>)
    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link.props.className).toContain('underline')
    expect(link.props.className).toContain('text-text-brand')
  })

  it('abre o href com Linking.openURL', () => {
    render(<Link href="https://x.test/docs">Docs</Link>)
    fireEvent.press(screen.getByText('Docs'))
    expect(Linking.openURL).toHaveBeenCalledWith('https://x.test/docs')
  })

  it('chama onPress e, sem href, não abre nada', () => {
    const onPress = jest.fn()
    render(<Link onPress={onPress}>Rota</Link>)
    fireEvent.press(screen.getByText('Rota'))
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(Linking.openURL).not.toHaveBeenCalled()
  })

  it('onPress e href juntos: dispara os dois', () => {
    const onPress = jest.fn()
    render(
      <Link href="https://x.test" onPress={onPress}>
        Ambos
      </Link>,
    )
    fireEvent.press(screen.getByText('Ambos'))
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(Linking.openURL).toHaveBeenCalledTimes(1)
  })

  it('engole a rejeição de openURL', async () => {
    jest.mocked(Linking.openURL).mockRejectedValue(new Error('sem app'))
    render(<Link href="foo://x">X</Link>)
    fireEvent.press(screen.getByText('X'))
    await Promise.resolve()
  })

  it('className do consumidor vence', () => {
    render(<Link className="text-status-error-text">X</Link>)
    const cls = screen.getByRole('link').props.className
    expect(cls).toContain('text-status-error-text')
    expect(cls).not.toContain('text-text-brand')
  })
})
