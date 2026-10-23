import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { ScrollView, Text } from 'react-native'
import { makeGesture } from '../../test/gesture'
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

  describe('barrinha de arraste', () => {
    const HANDLE = { className: 'h-1 w-10 rounded-[12px] bg-border-strong' }
    const handles = () => screen.UNSAFE_queryAllByProps(HANDLE).length

    it.each(['top', 'bottom'] as const)('aparece em %s', (side) => {
      render(
        <Drawer open title="T" side={side}>
          x
        </Drawer>,
      )
      expect(handles()).toBeGreaterThan(0)
    })

    it.each(['left', 'right'] as const)('não aparece em %s', (side) => {
      render(
        <Drawer open title="T" side={side}>
          x
        </Drawer>,
      )
      expect(handles()).toBe(0)
    })

    it('some com showHandle={false}', () => {
      render(
        <Drawer open title="T" side="bottom" showHandle={false}>
          x
        </Drawer>,
      )
      expect(handles()).toBe(0)
    })

    it('some com swipeToClose={false} (não promete um gesto que não existe)', () => {
      render(
        <Drawer open title="T" side="bottom" swipeToClose={false}>
          x
        </Drawer>,
      )
      expect(handles()).toBe(0)
    })

    it('o conteúdo vizinho encosta na faixa da barrinha, sem somar o padding', () => {
      const { rerender } = render(
        <Drawer open title="T" side="bottom">
          x
        </Drawer>,
      )
      expect(screen.getByRole('header').parent?.parent?.props.className).toContain('pt-0')
      rerender(
        <Drawer open title="T" side="bottom" showHandle={false}>
          x
        </Drawer>,
      )
      expect(screen.getByRole('header').parent?.parent?.props.className).not.toContain('pt-0')
    })
  })

  describe('arrastar para fechar', () => {
    const layout = (sheet: { props: Record<string, unknown> }, width = 400, height = 800) =>
      act(() =>
        (sheet.props.onLayout as (e: unknown) => void)({
          nativeEvent: { layout: { x: 0, y: 0, width, height } },
        }),
      )

    function setup(props: Record<string, unknown> = {}) {
      const onOpenChange = jest.fn()
      render(
        <Drawer open onOpenChange={onOpenChange} title="T" testID="d" {...props}>
          x
        </Drawer>,
      )
      const sheet = screen.getByTestId('d-sheet')
      layout(sheet)
      return { onOpenChange, gesture: makeGesture(sheet), sheet }
    }

    it('arrastar além de 40% fecha, e a contagem parte de onde o painel assumiu', () => {
      const { onOpenChange, gesture } = setup()
      gesture.down(100, 300)
      expect(gesture.move(120, 300, 1000)).toBe(true) // assume aqui (20px de folga)
      gesture.move(250, 300, 2000) // 130px desde o grant: 32% de 400
      gesture.up(250, 300, 2000)
      expect(onOpenChange).not.toHaveBeenCalled()

      gesture.down(100, 300)
      gesture.move(120, 300, 1000)
      gesture.move(300, 300, 2000) // 180px desde o grant: 45%
      gesture.up(300, 300, 2000)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('um gesto rápido fecha mesmo curto', () => {
      const { onOpenChange, gesture } = setup()
      gesture.down(100, 300, 0)
      gesture.move(120, 300, 16)
      gesture.move(180, 300, 32) // 60px em 16ms
      gesture.up(180, 300, 32)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it.each([
      ['right', [300, 300], [100, 300]],
      ['left', [100, 300], [300, 300]],
      ['bottom', [200, 500], [200, 300]],
      ['top', [200, 300], [200, 500]],
    ] as const)('arrastar para longe da borda de %s não faz nada', (side, from, to) => {
      const { onOpenChange, gesture } = setup({ side })
      gesture.down(from[0], from[1])
      expect(gesture.move(to[0], to[1], 1000)).toBe(false)
      gesture.up(to[0], to[1], 1000)
      expect(onOpenChange).not.toHaveBeenCalled()
    })

    it.each([
      ['bottom', [200, 20], [200, 790]],
      ['top', [200, 790], [200, 20]],
      ['left', [390, 300], [10, 300]],
    ] as const)('fecha na direção da borda de %s', (side, from, to) => {
      const { onOpenChange, gesture } = setup({ side })
      gesture.down(from[0], from[1])
      gesture.move((from[0] + to[0]) / 2, (from[1] + to[1]) / 2, 1000)
      gesture.move(to[0], to[1], 2000)
      gesture.up(to[0], to[1], 2000)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('ignora o gesto vertical num painel lateral', () => {
      const { gesture } = setup()
      gesture.down(100, 100)
      expect(gesture.move(110, 300, 1000)).toBe(false)
    })

    it('swipeToClose={false} desliga o gesto', () => {
      const { gesture } = setup({ swipeToClose: false })
      gesture.down(100, 300)
      expect(gesture.move(300, 300, 1000)).toBe(false)
    })

    it('com o corpo rolado, o dedo rola o conteúdo; ao chegar ao começo, o painel assume', () => {
      const { onOpenChange, gesture } = setup({ side: 'bottom' })
      const scroll = (y: number) =>
        act(() =>
          (screen.UNSAFE_getByType(ScrollView).props.onScroll as (e: unknown) => void)({
            nativeEvent: {
              contentOffset: { x: 0, y },
              contentSize: { width: 400, height: 1500 },
              layoutMeasurement: { width: 400, height: 400 },
            },
          }),
        )
      scroll(300)
      gesture.down(200, 100, 0)
      expect(gesture.move(200, 140, 100)).toBe(false) // o corpo ainda rola
      expect(gesture.move(200, 200, 200)).toBe(false)
      scroll(0) // o navegador rolou até o começo
      expect(gesture.move(200, 260, 300)).toBe(true) // o painel assume dali
      gesture.move(200, 650, 1300) // 390px desde o grant: 48% de 800
      gesture.up(200, 650, 1300)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('controlado e ignorando o fechamento: o painel volta em vez de ficar torto', () => {
      const { onOpenChange, gesture } = setup()
      gesture.down(100, 300)
      gesture.move(120, 300, 1000)
      gesture.move(380, 300, 2000)
      gesture.up(380, 300, 2000)
      expect(onOpenChange).toHaveBeenCalledWith(false)
      act(() => jest.advanceTimersByTime(500)) // `open` continua true: reset, sem erro
      expect(screen.getByText('x')).toBeTruthy()
    })
  })
})
