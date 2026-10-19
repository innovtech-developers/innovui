import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Step, Stepper } from './stepper'

function Example({ current }: { current: number }) {
  return (
    <Stepper current={current} aria-label="Etapas do cadastro">
      <Step>Conta</Step>
      <Step>Endereço</Step>
      <Step>Pagamento</Step>
    </Stepper>
  )
}

describe('Stepper', () => {
  it('é uma lista ordenada com um item por passo', () => {
    render(<Example current={0} />)
    expect(screen.getByRole('list', { name: 'Etapas do cadastro' }).tagName).toBe('OL')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('marca só o passo atual com aria-current="step"', () => {
    render(<Example current={1} />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).not.toHaveAttribute('aria-current')
    expect(items[1]).toHaveAttribute('aria-current', 'step')
    expect(items[2]).not.toHaveAttribute('aria-current')
  })

  it('os passos anteriores ficam concluídos (✓ + texto para leitores de tela)', () => {
    const { container } = render(<Example current={2} />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('(concluído)')
    expect(items[1]).toHaveTextContent('(concluído)')
    expect(items[2]).not.toHaveTextContent('(concluído)')
    expect(container.querySelectorAll('svg')).toHaveLength(2)
  })

  it('o passo atual e os pendentes mostram o número da posição', () => {
    render(<Example current={0} />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('1Conta')
    expect(items[1]).toHaveTextContent('2Endereço')
    expect(items[2]).toHaveTextContent('3Pagamento')
  })

  it('cada estado usa o fundo do indicador do Figma', () => {
    render(<Example current={1} />)
    const indicators = screen.getAllByRole('listitem').map((li) => li.firstElementChild)
    expect(indicators[0]).toHaveClass('iu:bg-[var(--color-bg-success-emphasis)]')
    expect(indicators[1]).toHaveClass('iu:bg-[var(--color-interactive-primary)]')
    expect(indicators[2]).toHaveClass('iu:bg-[var(--color-interactive-disabled)]')
  })

  it('o rótulo do passo pendente usa a cor terciária', () => {
    render(<Example current={0} />)
    expect(screen.getByText('Pagamento')).toHaveClass('iu:text-[var(--color-text-tertiary)]')
    expect(screen.getByText('Conta')).toHaveClass('iu:text-[var(--color-text-primary)]')
  })

  it('mescla className e repassa props HTML', () => {
    render(
      <Stepper current={0} className="iu:mt-4" data-testid="s">
        <Step className="iu:ml-2">Um</Step>
      </Stepper>,
    )
    expect(screen.getByTestId('s')).toHaveClass('iu:mt-4', 'iu:flex')
    expect(screen.getByRole('listitem')).toHaveClass('iu:ml-2')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Example current={1} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
