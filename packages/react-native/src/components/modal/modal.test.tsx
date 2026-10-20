import { fireEvent, render, screen } from '@testing-library/react-native'
import { useState } from 'react'
import { Text } from 'react-native'
import { Button } from '../button/button'
import { Modal, ModalClose } from './modal'

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
    expect(screen.queryByText('x')).toBeNull()

    fireEvent.press(screen.getByRole('button', { name: 'Abrir' }))
    fireEvent.press(screen.getByTestId('m-backdrop'))
    expect(screen.queryByText('x')).toBeNull()

    fireEvent.press(screen.getByRole('button', { name: 'Abrir' }))
    fireEvent.press(screen.getByRole('button', { name: 'Ok' }))
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
