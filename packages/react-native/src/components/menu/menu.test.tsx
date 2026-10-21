import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { Text, View } from 'react-native'
import { Button } from '../button/button'
import { Menu, MenuItem, MenuLabel, MenuSeparator } from './menu'

const settle = () => act(() => jest.advanceTimersByTime(500)) // a saída é animada

beforeEach(() => {
  jest.useFakeTimers()
  jest.spyOn(View.prototype, 'measureInWindow').mockImplementation((cb) => cb(20, 100, 80, 40))
})
afterEach(() => {
  jest.useRealTimers()
  jest.restoreAllMocks()
})

function setup(props: Partial<React.ComponentProps<typeof Menu>> = {}) {
  const onEdit = jest.fn()
  const onDelete = jest.fn()
  render(
    <Menu trigger={<Button>Ações</Button>} testID="menu" {...props}>
      <MenuLabel>Conta</MenuLabel>
      <MenuItem onSelect={onEdit} icon={<Text>i</Text>}>
        Editar
      </MenuItem>
      <MenuSeparator />
      <MenuItem destructive onSelect={onDelete}>
        Excluir
      </MenuItem>
      <MenuItem disabled>Bloqueado</MenuItem>
    </Menu>,
  )
  return { onEdit, onDelete }
}

describe('Menu', () => {
  it('abre pelo gatilho e mostra os itens', () => {
    const { onEdit } = setup()
    expect(screen.queryByText('Editar')).toBeNull()
    fireEvent.press(screen.getByRole('button', { name: 'Ações' }))
    expect(screen.getByText('Conta')).toBeTruthy()
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
    expect(onEdit).not.toHaveBeenCalled()
  })

  it('escolher um item chama onSelect e fecha', () => {
    const { onEdit } = setup()
    fireEvent.press(screen.getByRole('button', { name: 'Ações' }))
    fireEvent.press(screen.getByRole('menuitem', { name: 'Editar' }))
    expect(onEdit).toHaveBeenCalledTimes(1)
    settle()
    expect(screen.queryByText('Editar')).toBeNull()
  })

  it('item destrutivo fica vermelho e desabilitado fica apagado e não dispara', () => {
    setup({ defaultOpen: true })
    expect(screen.getByText('Excluir').props.className).toContain('text-status-error-text')
    expect(screen.getByText('Bloqueado').props.className).toContain('text-text-disabled')
    expect(screen.getByRole('menuitem', { name: 'Bloqueado' })).toBeDisabled()
  })

  it('fecha ao tocar fora e notifica onOpenChange', () => {
    const onOpenChange = jest.fn()
    setup({ onOpenChange })
    fireEvent.press(screen.getByRole('button', { name: 'Ações' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    fireEvent.press(screen.getByTestId('menu-backdrop'))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    settle()
    expect(screen.queryByText('Editar')).toBeNull()
  })

  it('aplica className no conteúdo', () => {
    setup({ defaultOpen: true, className: 'w-64' })
    expect(screen.getByTestId('menu').props.className).toContain('w-64')
    expect(screen.getByTestId('menu').props.className).toContain('min-w-[180px]')
  })
})
