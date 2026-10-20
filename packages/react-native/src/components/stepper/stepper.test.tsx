import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Step, Stepper } from './stepper'

function Example({ current }: { current: number }) {
  return (
    <Stepper current={current}>
      <Step>Carrinho</Step>
      <Step>Endereço</Step>
      <Step>Pagamento</Step>
    </Stepper>
  )
}

// Sobe a partir do número até o círculo, que é quem leva o `bg-*`.
function indicatorClass(n: string) {
  let el = screen.getByText(n, { includeHiddenElements: true }).parent
  while (el && !String(el.props.className ?? '').includes('rounded-full')) el = el.parent
  return el?.props.className as string
}

describe('Stepper', () => {
  it('numera os passos pela posição', () => {
    render(<Example current={0} />)
    expect(screen.getByText('1', { includeHiddenElements: true })).toBeTruthy()
    expect(screen.getByText('2', { includeHiddenElements: true })).toBeTruthy()
    expect(screen.getByText('3', { includeHiddenElements: true })).toBeTruthy()
  })

  it('marca o passo atual como selecionado', () => {
    render(<Example current={1} />)
    expect(screen.getByText('Endereço').parent?.parent?.props.accessibilityState).toMatchObject({
      selected: true,
    })
    expect(screen.getByText('Pagamento').parent?.parent?.props.accessibilityState).toMatchObject({
      selected: false,
    })
  })

  it('passo concluído troca o número pelo check e anuncia "concluído"', () => {
    render(<Example current={1} />)
    expect(screen.queryByText('1', { includeHiddenElements: true })).toBeNull()
    expect(screen.getByLabelText('Carrinho (concluído)')).toBeTruthy()
  })

  it('aplica cores por estado ao indicador e ao rótulo', () => {
    render(<Example current={1} />)
    expect(screen.getByText('Carrinho').props.className).toContain('text-text-primary')
    expect(screen.getByText('Endereço').props.className).toContain('text-text-primary')
    expect(screen.getByText('Pagamento').props.className).toContain('text-text-tertiary')
    expect(indicatorClass('2')).toContain('bg-interactive-primary')
    expect(indicatorClass('3')).toContain('bg-interactive-disabled')
  })

  it('completedLabel e className são configuráveis; aceita nós como rótulo', () => {
    render(
      <Stepper current={1} className="gap-4" testID="root">
        <Step completedLabel="feito">Um</Step>
        <Step className="px-2">
          <Text>Dois</Text>
        </Step>
      </Stepper>,
    )
    expect(screen.getByLabelText('Um (feito)')).toBeTruthy()
    expect(screen.getByTestId('root').props.className).toContain('gap-4')
    expect(screen.getByText('Dois')).toBeTruthy()
  })
})
