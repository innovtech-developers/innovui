import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Accordion, AccordionItem } from './accordion'

function renderAccordion(props: Record<string, unknown> = {}) {
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

const header = (name: string) => screen.getByRole('button', { name })

describe('Accordion', () => {
  it('começa recolhido e o cabeçalho é botão com estado expanded', () => {
    renderAccordion()
    expect(header('Pagamento').props.accessibilityState).toMatchObject({ expanded: false })
    expect(screen.queryByText('Aceitamos cartão e Pix.')).toBeNull()
  })

  it('tocar expande e tocar de novo recolhe (collapsible)', () => {
    renderAccordion()
    fireEvent.press(header('Pagamento'))
    expect(header('Pagamento').props.accessibilityState).toMatchObject({ expanded: true })
    expect(screen.getByText('Aceitamos cartão e Pix.')).toBeTruthy()
    fireEvent.press(header('Pagamento'))
    expect(screen.queryByText('Aceitamos cartão e Pix.')).toBeNull()
  })

  it('sem collapsible, a seção aberta não fecha', () => {
    renderAccordion({ collapsible: false, defaultValue: 'a' })
    fireEvent.press(header('Pagamento'))
    expect(screen.getByText('Aceitamos cartão e Pix.')).toBeTruthy()
  })

  it('no modo single, abrir uma seção fecha a outra', () => {
    renderAccordion()
    fireEvent.press(header('Pagamento'))
    fireEvent.press(header('Entrega'))
    expect(screen.queryByText('Aceitamos cartão e Pix.')).toBeNull()
    expect(screen.getByText('Entregamos em 3 dias.')).toBeTruthy()
  })

  it('no modo multiple, várias ficam abertas', () => {
    const onValueChange = jest.fn()
    render(
      <Accordion type="multiple" onValueChange={onValueChange}>
        <AccordionItem value="a" title="A">
          a
        </AccordionItem>
        <AccordionItem value="b" title="B">
          b
        </AccordionItem>
      </Accordion>,
    )
    fireEvent.press(header('A'))
    fireEvent.press(header('B'))
    expect(screen.getByText('a')).toBeTruthy()
    expect(screen.getByText('b')).toBeTruthy()
    expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b'])
  })

  it('defaultValue abre a seção inicial e onValueChange avisa', () => {
    const onValueChange = jest.fn()
    renderAccordion({ defaultValue: 'b', onValueChange })
    expect(screen.getByText('Entregamos em 3 dias.')).toBeTruthy()
    fireEvent.press(header('Pagamento'))
    expect(onValueChange).toHaveBeenCalledWith('a')
    fireEvent.press(header('Pagamento'))
    expect(onValueChange).toHaveBeenLastCalledWith('')
  })

  it('controlado: só muda quando o pai muda o value', () => {
    const onValueChange = jest.fn()
    const { rerender } = renderAccordion({ value: 'a', onValueChange })
    fireEvent.press(header('Entrega'))
    expect(onValueChange).toHaveBeenCalledWith('b')
    expect(screen.queryByText('Entregamos em 3 dias.')).toBeNull()
    rerender(
      <Accordion type="single" value="b" onValueChange={onValueChange}>
        <AccordionItem value="b" title="Entrega">
          Entregamos em 3 dias.
        </AccordionItem>
      </Accordion>,
    )
    expect(screen.getByText('Entregamos em 3 dias.')).toBeTruthy()
  })

  it('seção desabilitada não abre', () => {
    renderAccordion()
    expect(header('Troca')).toBeDisabled()
    fireEvent.press(header('Troca'))
    expect(screen.queryByText('Em até 30 dias.')).toBeNull()
    expect(screen.getByText('Troca').props.className).toContain('text-text-disabled')
  })

  it('aceita nós no título e no conteúdo', () => {
    render(
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a" title={<Text>Título</Text>}>
          <Text>Corpo</Text>
        </AccordionItem>
      </Accordion>,
    )
    expect(screen.getByText('Título')).toBeTruthy()
    expect(screen.getByText('Corpo')).toBeTruthy()
  })

  it('className chega à raiz e ao item', () => {
    render(
      <Accordion type="single" className="max-w-md" testID="root">
        <AccordionItem value="a" title="A" className="border-0" testID="item">
          a
        </AccordionItem>
      </Accordion>,
    )
    expect(screen.getByTestId('root').props.className).toContain('max-w-md')
    expect(screen.getByTestId('item').props.className).toContain('border-0')
    expect(screen.getByTestId('item').props.className.split(' ')).not.toContain('border-b')
  })
})
