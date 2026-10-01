import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renderiza o label', () => {
    render(<Button>Salvar alterações</Button>)
    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument()
  })

  it('usa type="button" por padrão, para não submeter formulários sem querer', () => {
    render(<Button>Ação</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('aceita type="submit" explícito', () => {
    render(<Button type="submit">Enviar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('dispara onClick ao clicar', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Clique</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('fica desabilitado via a prop disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Ação
      </Button>,
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('no estado loading, fica desabilitado, marca aria-busy e troca o ícone por um spinner', () => {
    render(
      <Button loading leadingIcon={<span data-testid="icon">★</span>}>
        Salvando
      </Button>,
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Carregando' })).toBeInTheDocument()
    expect(screen.getByText('Salvando')).toBeInTheDocument()
  })

  it('no tamanho lg, usa um spinner md ao carregar', () => {
    render(
      <Button loading size="lg">
        Salvando
      </Button>,
    )
    expect(screen.getByRole('status')).toHaveClass('iu:size-5')
  })

  it('renderiza ícones leading e trailing quando não está carregando', () => {
    render(
      <Button
        leadingIcon={<span data-testid="leading" />}
        trailingIcon={<span data-testid="trailing" />}
      >
        Ação
      </Button>,
    )
    expect(screen.getByTestId('leading')).toBeInTheDocument()
    expect(screen.getByTestId('trailing')).toBeInTheDocument()
  })

  it('mescla className customizada sem perder as classes de variante', () => {
    render(<Button className="iu:mt-4">Ação</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('iu:mt-4')
    expect(button).toHaveClass('iu:rounded-full')
  })

  it('repassa demais props HTML, como aria-label', () => {
    render(<Button aria-label="Fechar">×</Button>)
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
  })

  it.each(['primary', 'secondary', 'tertiary', 'ghost', 'destructive'] as const)(
    'renderiza a variante %s',
    (variant) => {
      render(<Button variant={variant}>Ação</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    },
  )

  it.each(['lg', 'md', 'sm'] as const)('renderiza o tamanho %s', (size) => {
    render(<Button size={size}>Ação</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Button>Salvar alterações</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('não tem violações de acessibilidade no estado loading', async () => {
    const { container } = render(<Button loading>Salvando</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
