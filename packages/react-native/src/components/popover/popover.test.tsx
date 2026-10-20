import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text, View } from 'react-native'
import { Button } from '../button/button'
import { Popover, PopoverClose } from './popover'

beforeEach(() => {
  // O mock de View do Jest nunca chama o callback de medição.
  jest.spyOn(View.prototype, 'measureInWindow').mockImplementation((cb) => cb(20, 100, 80, 40))
})
afterEach(() => jest.restoreAllMocks())

describe('Popover', () => {
  it('não mostra o conteúdo fechado e abre pelo gatilho', () => {
    const onOpenChange = jest.fn()
    render(
      <Popover trigger={<Button>Filtros</Button>} label="Filtros" onOpenChange={onOpenChange}>
        <Text>conteúdo</Text>
      </Popover>,
    )
    expect(screen.queryByText('conteúdo')).toBeNull()
    fireEvent.press(screen.getByRole('button', { name: 'Filtros' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.getByText('conteúdo')).toBeTruthy()
    expect(screen.getByLabelText('Filtros', { exact: true })).toBeTruthy()
  })

  it('abre pelo modo controlado e aplica className', () => {
    render(
      <Popover open trigger={<Button>Abrir</Button>} label="Painel" className="p-2" testID="p">
        <Text>conteúdo</Text>
      </Popover>,
    )
    expect(screen.getByText('conteúdo')).toBeTruthy()
    expect(screen.getByTestId('p').props.className).toContain('p-2')
    expect(screen.getByTestId('p').props.className).toContain('bg-surface-elevated')
  })

  it('fecha ao tocar fora e pelo PopoverClose', () => {
    render(
      <Popover defaultOpen trigger={<Button>Abrir</Button>} label="Painel" testID="p">
        <PopoverClose>
          <Button>Fechar</Button>
        </PopoverClose>
      </Popover>,
    )
    fireEvent.press(screen.getByTestId('p-backdrop'))
    expect(screen.queryByRole('button', { name: 'Fechar' })).toBeNull()

    fireEvent.press(screen.getByRole('button', { name: 'Abrir' }))
    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByRole('button', { name: 'Fechar' })).toBeNull()
  })
})
