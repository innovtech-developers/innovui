import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Tab, TabList, TabPanel, Tabs, type TabsProps } from './tabs'

function Example(props: TabsProps) {
  return (
    <Tabs defaultValue="geral" {...props}>
      <TabList accessibilityLabel="Configurações">
        <Tab value="geral">Geral</Tab>
        <Tab value="conta" icon={<Text>ic</Text>}>
          Conta
        </Tab>
        <Tab value="faturas" disabled>
          Faturas
        </Tab>
      </TabList>
      <TabPanel value="geral">
        <Text>Conteúdo geral</Text>
      </TabPanel>
      <TabPanel value="conta">
        <Text>Conteúdo da conta</Text>
      </TabPanel>
      <TabPanel value="faturas">
        <Text>Conteúdo das faturas</Text>
      </TabPanel>
    </Tabs>
  )
}

const tab = (name: string) => screen.getByRole('tab', { name })

describe('Tabs', () => {
  it('mostra a lista de abas e só o painel ativo', () => {
    render(<Example />)
    expect(screen.getByLabelText('Configurações').props.accessibilityRole).toBe('tablist')
    expect(tab('Geral').props.accessibilityState).toMatchObject({ selected: true })
    expect(tab('Conta').props.accessibilityState).toMatchObject({ selected: false })
    expect(screen.getByText('Conteúdo geral')).toBeTruthy()
    expect(screen.queryByText('Conteúdo da conta')).toBeNull()
  })

  it('tocar numa aba troca o painel e avisa onValueChange', () => {
    const onValueChange = jest.fn()
    render(<Example onValueChange={onValueChange} />)
    fireEvent.press(tab('Conta'))
    expect(onValueChange).toHaveBeenCalledWith('conta')
    expect(screen.getByText('Conteúdo da conta')).toBeTruthy()
    expect(screen.queryByText('Conteúdo geral')).toBeNull()
    expect(screen.getByText('ic')).toBeTruthy()
  })

  it('aba desabilitada não troca', () => {
    render(<Example />)
    expect(tab('Faturas')).toBeDisabled()
    fireEvent.press(tab('Faturas'))
    expect(screen.queryByText('Conteúdo das faturas')).toBeNull()
    expect(screen.getByText('Faturas').props.className).toContain('text-text-disabled')
  })

  it('controlado: só muda quando o pai muda o value', () => {
    const onValueChange = jest.fn()
    const { rerender } = render(<Example value="geral" onValueChange={onValueChange} />)
    fireEvent.press(tab('Conta'))
    expect(onValueChange).toHaveBeenCalledWith('conta')
    expect(screen.getByText('Conteúdo geral')).toBeTruthy()
    rerender(<Example value="conta" onValueChange={onValueChange} />)
    expect(screen.getByText('Conteúdo da conta')).toBeTruthy()
  })

  it('aplica o estilo da aba ativa e o className do consumidor', () => {
    render(
      <Tabs defaultValue="a" className="flex-1" testID="root">
        <TabList>
          <Tab value="a" className="px-8">
            A
          </Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a" className="p-4" testID="panel">
          <Text>x</Text>
        </TabPanel>
      </Tabs>,
    )
    expect(screen.getByTestId('root').props.className).toBe('flex-1')
    expect(screen.getByTestId('panel').props.className).toBe('p-4')
    expect(screen.getByText('A').props.className).toContain('text-text-brand')
    expect(screen.getByText('B').props.className).not.toContain('text-text-brand')
    expect(tab('A').props.className).toContain('px-8')
    expect(tab('A').props.className).not.toContain('px-3')
  })
})
