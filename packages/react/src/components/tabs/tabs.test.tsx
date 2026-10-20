import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Tab, TabList, TabPanel, Tabs } from './tabs'

function Example({ onValueChange }: { onValueChange?: (value: string) => void }) {
  return (
    <Tabs defaultValue="geral" onValueChange={onValueChange}>
      <TabList aria-label="Configurações">
        <Tab value="geral">Geral</Tab>
        <Tab value="conta" icon={<svg data-testid="icon" aria-hidden="true" />}>
          Conta
        </Tab>
        <Tab value="faturas" disabled>
          Faturas
        </Tab>
      </TabList>
      <TabPanel value="geral">Conteúdo geral</TabPanel>
      <TabPanel value="conta">Conteúdo da conta</TabPanel>
      <TabPanel value="faturas">Conteúdo das faturas</TabPanel>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('expõe tablist, tabs e o painel ativo', () => {
    render(<Example />)
    expect(screen.getByRole('tablist', { name: 'Configurações' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'Geral' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Conteúdo geral')
  })

  it('troca de aba ao clicar e avisa onValueChange', async () => {
    const onValueChange = vi.fn()
    render(<Example onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Conta' }))
    expect(onValueChange).toHaveBeenCalledWith('conta')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Conteúdo da conta')
  })

  it('navega pelas abas com as setas, pulando a desabilitada', async () => {
    render(<Example />)
    await userEvent.click(screen.getByRole('tab', { name: 'Geral' }))
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Conta' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Geral' })).toHaveFocus()
  })

  it('a aba desabilitada não é ativada', async () => {
    render(<Example />)
    expect(screen.getByRole('tab', { name: 'Faturas' })).toBeDisabled()
    await userEvent.click(screen.getByRole('tab', { name: 'Faturas' }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Conteúdo geral')
  })

  it('renderiza o ícone antes do rótulo', () => {
    render(<Example />)
    expect(screen.getByRole('tab', { name: 'Conta' })).toContainElement(screen.getByTestId('icon'))
  })

  it('a aba ativa tem o destaque da marca e o indicador', () => {
    render(<Example />)
    const tab = screen.getByRole('tab', { name: 'Geral' })
    expect(tab).toHaveClass('iu:data-[state=active]:text-[var(--color-text-brand)]')
    expect(tab.querySelector('[aria-hidden="true"]')).toHaveClass('iu:h-0.5')
  })

  it('o sublinhado é um indicador único na lista, que assume o desenho das abas depois de medir', () => {
    render(<Example />)
    const list = screen.getByRole('tablist')
    expect(list).toHaveAttribute('data-slide')
    const indicator = list.querySelector(':scope > span[aria-hidden="true"]')
    expect(indicator).toHaveClass('iu:absolute')
    // o indicador é decorativo: não entra na ordem de abas nem na árvore de acessibilidade
    expect(within(list).getAllByRole('tab')).toHaveLength(3)
  })

  it('mescla className e repassa props HTML', () => {
    render(
      <Tabs defaultValue="a">
        <TabList className="iu:mt-4" data-testid="list">
          <Tab value="a" className="iu:ml-2">
            A
          </Tab>
        </TabList>
        <TabPanel value="a" className="iu:mt-2">
          Painel
        </TabPanel>
      </Tabs>,
    )
    expect(screen.getByTestId('list')).toHaveClass('iu:mt-4', 'iu:flex')
    expect(screen.getByRole('tab')).toHaveClass('iu:ml-2', 'iu:rounded-sm')
    expect(screen.getByRole('tabpanel')).toHaveClass('iu:mt-2')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Example />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
