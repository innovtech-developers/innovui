import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Button } from '../button/button'
import { Drawer, DrawerClose } from './drawer'

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

const settle = () => act(() => jest.advanceTimersByTime(500))

describe('Drawer', () => {
  it('não renderiza o conteúdo fechado', () => {
    render(
      <Drawer open={false} title="Título">
        Corpo
      </Drawer>,
    )
    expect(screen.queryByText('Título')).toBeNull()
  })

  it('mostra título, corpo e rodapé quando aberto', () => {
    render(
      <Drawer open title="Título" footer={<Text>rodapé</Text>}>
        Corpo
      </Drawer>,
    )
    expect(screen.getByRole('header')).toHaveTextContent('Título')
    expect(screen.getByText('Corpo')).toBeTruthy()
    expect(screen.getByText('rodapé')).toBeTruthy()
  })

  it.each([
    ['right', 'border-l'],
    ['left', 'border-r'],
    ['top', 'border-b'],
    ['bottom', 'border-t'],
  ] as const)('lado %s', (side, expected) => {
    render(
      <Drawer open title="T" side={side} className="p-2" testID="d">
        x
      </Drawer>,
    )
    expect(screen.getByTestId('d').props.className).toContain(expected)
    expect(screen.getByTestId('d').props.className).toContain('p-2')
  })

  it('abre pelo trigger e fecha no ×, no backdrop e no DrawerClose, após a animação', () => {
    const onOpenChange = jest.fn()
    render(
      <Drawer
        title="T"
        testID="d"
        onOpenChange={onOpenChange}
        trigger={<Button>Abrir</Button>}
        footer={
          <DrawerClose>
            <Button>Ok</Button>
          </DrawerClose>
        }
      >
        x
      </Drawer>,
    )
    expect(screen.queryByText('x')).toBeNull()

    fireEvent.press(screen.getByRole('button', { name: 'Abrir' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(screen.getByText('x')).toBeTruthy()

    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    settle()
    expect(screen.queryByText('x')).toBeNull()

    fireEvent.press(screen.getByRole('button', { name: 'Abrir' }))
    fireEvent.press(screen.getByTestId('d-backdrop'))
    settle()
    expect(screen.queryByText('x')).toBeNull()

    fireEvent.press(screen.getByRole('button', { name: 'Abrir' }))
    fireEvent.press(screen.getByRole('button', { name: 'Ok' }))
    settle()
    expect(screen.queryByText('x')).toBeNull()
  })

  it('usa o closeLabel no ×', () => {
    render(
      <Drawer open title="T" closeLabel="Sair">
        x
      </Drawer>,
    )
    expect(screen.getByRole('button', { name: 'Sair' })).toBeTruthy()
  })
})
