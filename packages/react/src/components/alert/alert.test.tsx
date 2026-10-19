import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Alert } from './alert'

describe('Alert', () => {
  it('renderiza título e descrição', () => {
    render(<Alert title="Pagamento aprovado">Seu pedido foi confirmado.</Alert>)
    expect(screen.getByText('Pagamento aprovado')).toBeInTheDocument()
    expect(screen.getByText('Seu pedido foi confirmado.')).toBeInTheDocument()
  })

  it('funciona sem título', () => {
    render(<Alert>Só a descrição.</Alert>)
    expect(screen.getByText('Só a descrição.')).toBeInTheDocument()
  })

  it('usa o status info por padrão', () => {
    render(<Alert>Texto</Alert>)
    expect(screen.getByRole('status')).toHaveClass('iu:bg-[var(--color-status-info-bg)]')
  })

  it.each(['success', 'error', 'warning', 'info', 'neutral'] as const)(
    'aplica fundo e borda do status %s',
    (status) => {
      render(<Alert status={status}>Texto</Alert>)
      const alert = screen.getByText('Texto').closest('[class*="iu:border-l-3"]')
      expect(alert).toHaveClass(`iu:bg-[var(--color-status-${status}-bg)]`)
      expect(alert).toHaveClass(`iu:border-[var(--color-status-${status}-border)]`)
    },
  )

  it('erro e aviso usam role="alert"; os demais, role="status"', () => {
    const { rerender } = render(<Alert status="error">Texto</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    rerender(<Alert status="warning">Texto</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    rerender(<Alert status="success">Texto</Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('mostra o ícone por padrão e o esconde com showIcon={false}', () => {
    const { container, rerender } = render(<Alert>Texto</Alert>)
    expect(container.querySelector('svg')).toBeInTheDocument()
    rerender(<Alert showIcon={false}>Texto</Alert>)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('renderiza a ação', () => {
    render(<Alert action={<button type="button">Desfazer</button>}>Texto</Alert>)
    expect(screen.getByRole('button', { name: 'Desfazer' })).toBeInTheDocument()
  })

  it('não mostra botão de fechar sem onDismiss', () => {
    render(<Alert>Texto</Alert>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('com onDismiss, mostra o botão e o chama ao clicar', async () => {
    const onDismiss = vi.fn()
    render(<Alert onDismiss={onDismiss}>Texto</Alert>)
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('permite trocar o nome acessível do botão de fechar', () => {
    render(
      <Alert onDismiss={() => {}} dismissLabel="Dispensar aviso">
        Texto
      </Alert>,
    )
    expect(screen.getByRole('button', { name: 'Dispensar aviso' })).toBeInTheDocument()
  })

  it('mescla className e repassa props HTML', () => {
    render(
      <Alert className="iu:mt-4" data-testid="a">
        Texto
      </Alert>,
    )
    expect(screen.getByTestId('a')).toHaveClass('iu:mt-4', 'iu:rounded-md')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <>
        <Alert status="success" title="Título" onDismiss={() => {}} action={<a href="/">Ver</a>}>
          Descrição
        </Alert>
        <Alert status="error">Descrição</Alert>
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
