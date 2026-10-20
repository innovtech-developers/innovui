import { render, screen } from '@testing-library/react-native'
import { Input } from '../input/input'
import { Field } from './field'

const control = () => screen.getByPlaceholderText('x')

describe('Field', () => {
  it('rotula o controle pelo accessibilityLabel', () => {
    render(
      <Field label="E-mail">
        <Input placeholder="x" />
      </Field>,
    )
    expect(screen.getByText('E-mail')).toBeTruthy()
    expect(control().props.accessibilityLabel).toBe('E-mail')
  })

  it('respeita o accessibilityLabel do próprio controle', () => {
    render(
      <Field label="E-mail">
        <Input placeholder="x" accessibilityLabel="Endereço" />
      </Field>,
    )
    expect(control().props.accessibilityLabel).toBe('Endereço')
  })

  it('exibe o asterisco escondido do leitor de tela quando required', () => {
    render(
      <Field label="E-mail" required>
        <Input placeholder="x" />
      </Field>,
    )
    const star = screen.getByText('*', { exact: false, includeHiddenElements: true })
    expect(star.props.accessibilityElementsHidden).toBe(true)
  })

  it('usa o supportingText como dica do controle', () => {
    render(
      <Field label="E-mail" supportingText="Usaremos para enviar o acesso.">
        <Input placeholder="x" />
      </Field>,
    )
    expect(screen.getByText('Usaremos para enviar o acesso.')).toBeTruthy()
    expect(control().props.accessibilityHint).toBe('Usaremos para enviar o acesso.')
  })

  it('propaga error: rótulo, texto e controle em vermelho, com ícone', () => {
    render(
      <Field label="E-mail" error supportingText="Formato inválido.">
        <Input placeholder="x" />
      </Field>,
    )
    expect(screen.getByText('E-mail').props.className).toContain('text-status-error-text')
    expect(screen.getByText('Formato inválido.').props.className).toContain(
      'text-status-error-text',
    )
    expect(control().props.className).toContain('border-field-border-error')
    expect(
      screen.getByText('Formato inválido.').parent?.parent?.props.accessibilityLiveRegion,
    ).toBe('polite')
  })

  it('não mostra erro sem a prop', () => {
    render(
      <Field label="E-mail" supportingText="Ajuda">
        <Input placeholder="x" />
      </Field>,
    )
    expect(screen.getByText('Ajuda').props.className).not.toContain('text-status-error-text')
  })

  it('propaga readOnly, disabled e size para o controle', () => {
    render(
      <Field label="Nome" readOnly disabled size="sm">
        <Input placeholder="x" />
      </Field>,
    )
    expect(control().props.editable).toBe(false)
    expect(control().props.className).toContain('h-10')
    expect(screen.getByText('Nome').props.className).toContain('text-xs')
  })
})
