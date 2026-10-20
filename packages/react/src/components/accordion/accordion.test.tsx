import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Accordion, AccordionItem } from './accordion'

function renderAccordion(
  props: { defaultValue?: string; onValueChange?: (v: string) => void } = {},
) {
  return render(
    <Accordion type="single" collapsible {...props}>
      <AccordionItem value="a" title="Pagamento">
        Aceitamos cartão e Pix.
      </AccordionItem>
      <AccordionItem value="b" title="Entrega">
        Entregamos em 3 dias.
      </AccordionItem>
      <AccordionItem value="c" title="Troca" disabled>
        Em até 30 dias.
      </AccordionItem>
    </Accordion>,
  )
}

describe('Accordion', () => {
  it('começa com tudo recolhido e o cabeçalho é um botão com aria-expanded', () => {
    renderAccordion()
    const trigger = screen.getByRole('button', { name: 'Pagamento' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Aceitamos cartão e Pix.')).not.toBeInTheDocument()
  })

  it('clicar expande e clicar de novo recolhe (collapsible)', async () => {
    renderAccordion()
    const trigger = screen.getByRole('button', { name: 'Pagamento' })
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Aceitamos cartão e Pix.')).toBeVisible()
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('no modo single, abrir uma seção fecha a outra', async () => {
    renderAccordion()
    await userEvent.click(screen.getByRole('button', { name: 'Pagamento' }))
    await userEvent.click(screen.getByRole('button', { name: 'Entrega' }))
    expect(screen.getByRole('button', { name: 'Pagamento' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('no modo multiple, várias ficam abertas', async () => {
    render(
      <Accordion type="multiple">
        <AccordionItem value="a" title="A">
          a
        </AccordionItem>
        <AccordionItem value="b" title="B">
          b
        </AccordionItem>
      </Accordion>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'A' }))
    await userEvent.click(screen.getByRole('button', { name: 'B' }))
    expect(screen.getByText('a')).toBeVisible()
    expect(screen.getByText('b')).toBeVisible()
  })

  it('defaultValue abre a seção inicial e onValueChange avisa', async () => {
    const onValueChange = vi.fn()
    renderAccordion({ defaultValue: 'b', onValueChange })
    expect(screen.getByText('Entregamos em 3 dias.')).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Pagamento' }))
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('setas navegam entre os cabeçalhos, pulando o desabilitado', async () => {
    renderAccordion()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Pagamento' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Entrega' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Pagamento' })).toHaveFocus()
  })

  it('Enter e Espaço expandem pelo teclado', async () => {
    renderAccordion()
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: 'Pagamento' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await userEvent.keyboard(' ')
    expect(screen.getByRole('button', { name: 'Pagamento' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('seção desabilitada não abre', async () => {
    renderAccordion()
    const trigger = screen.getByRole('button', { name: 'Troca' })
    expect(trigger).toBeDisabled()
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('className chega à raiz e ao item', () => {
    const { container } = render(
      <Accordion type="single" className="iu:max-w-md">
        <AccordionItem value="a" title="A" className="iu:border-0" data-testid="item">
          a
        </AccordionItem>
      </Accordion>,
    )
    expect(container.firstChild).toHaveClass('iu:max-w-md')
    expect(screen.getByTestId('item')).toHaveClass('iu:border-0')
    expect(screen.getByTestId('item')).not.toHaveClass('iu:border-b')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderAccordion({ defaultValue: 'a' })
    expect(await axe(container)).toHaveNoViolations()
  })
})
