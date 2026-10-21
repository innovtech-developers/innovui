import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button } from '../button/button'
import { Modal, ModalClose } from './modal'

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

// A saída é animada: o conteúdo só some depois dela.
const settle = () => act(() => jest.advanceTimersByTime(500))

describe('Modal', () => {
  it('não renderiza o conteúdo fechado', () => {
    render(
      <Modal open={false} title="Título">
        Corpo
      </Modal>,
    )
    expect(screen.queryByText('Título')).toBeNull()
  })

  it('mostra título, corpo e rodapé quando aberto', () => {
    render(
      <Modal open title="Título" footer={<Text>rodapé</Text>}>
        Corpo
      </Modal>,
    )
    expect(screen.getByRole('header')).toHaveTextContent('Título')
    expect(screen.getByText('Corpo')).toBeTruthy()
    expect(screen.getByText('rodapé')).toBeTruthy()
  })

  it('aplica tamanho e className', () => {
    render(
      <Modal open title="T" size="lg" className="p-2" testID="m">
        x
      </Modal>,
    )
    const card = screen.getByTestId('m')
    expect(card.props.className).toContain('max-w-[800px]')
    expect(card.props.className).toContain('p-2')
  })

  it('abre pelo trigger e fecha no ×, no backdrop e no ModalClose', () => {
    const onOpenChange = jest.fn()
    render(
      <Modal
        title="T"
        testID="m"
        onOpenChange={onOpenChange}
        trigger={<Button>Abrir</Button>}
        footer={
          <ModalClose>
            <Button>Ok</Button>
          </ModalClose>
        }
      >
        x
      </Modal>,
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
    fireEvent.press(screen.getByTestId('m-backdrop'))
    settle()
    expect(screen.queryByText('x')).toBeNull()

    fireEvent.press(screen.getByRole('button', { name: 'Abrir' }))
    fireEvent.press(screen.getByRole('button', { name: 'Ok' }))
    settle()
    expect(screen.queryByText('x')).toBeNull()
  })

  it('modo controlado: só fecha quando o pai muda open', () => {
    function Controlled() {
      const [open, setOpen] = useState(true)
      return (
        <Modal open={open} onOpenChange={setOpen} title="T" showClose={false}>
          x
        </Modal>
      )
    }
    render(<Controlled />)
    expect(screen.queryByRole('button', { name: 'Fechar' })).toBeNull()
    fireEvent(screen.getByText('x'), 'requestClose')
    settle()
    expect(screen.queryByText('x')).toBeNull()
  })

  it('o diálogo entra com fade e zoom de 95% e fica montado durante a saída', () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Button onPress={() => setOpen(true)}>Abrir</Button>
          <Modal open={open} onOpenChange={setOpen} title="T" testID="m">
            x
          </Modal>
        </>
      )
    }
    render(<Controlled />)
    fireEvent.press(screen.getByRole('button', { name: 'Abrir' }))
    // começa menor e transparente (a animação é nativa: no Jest só se vê o valor inicial)
    const style = StyleSheet.flatten(screen.getByTestId('m').parent?.parent?.parent?.props.style)
    expect(style.opacity).toBe(0)
    expect(style.transform[0].scale).toBeCloseTo(0.95)
    act(() => jest.advanceTimersByTime(400))

    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.getByText('x')).toBeTruthy() // ainda saindo
    settle()
    expect(screen.queryByText('x')).toBeNull()
  })

  it('esconde o × e as divisórias quando pedido', () => {
    render(
      <Modal open title="T" showClose={false} showHeaderDivider={false} closeLabel="Sair">
        x
      </Modal>,
    )
    expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull()
  })

  it('usa o closeLabel no ×', () => {
    render(
      <Modal open title="T" closeLabel="Sair">
        x
      </Modal>,
    )
    expect(screen.getByRole('button', { name: 'Sair' })).toBeTruthy()
  })
})
