import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Banner } from './banner'

describe('Banner', () => {
  it('renderiza a mensagem, com status info por padrão', () => {
    render(<Banner>Manutenção hoje às 22h.</Banner>)
    expect(screen.getByRole('status')).toHaveTextContent('Manutenção hoje às 22h.')
    expect(screen.getByRole('status')).toHaveClass('iu:bg-[var(--color-status-info-bg)]')
  })

  it.each(['success', 'error', 'warning', 'info', 'neutral'] as const)(
    'aplica o fundo do status %s',
    (status) => {
      render(<Banner status={status}>Texto</Banner>)
      expect(screen.getByText('Texto').closest('[role]')).toHaveClass(
        `iu:bg-[var(--color-status-${status}-bg)]`,
      )
    },
  )

  it('erro e aviso usam role="alert"', () => {
    render(<Banner status="error">Texto</Banner>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('mostra o ícone por padrão e o esconde com showIcon={false}', () => {
    const { container, rerender } = render(<Banner>Texto</Banner>)
    expect(container.querySelector('svg')).toBeInTheDocument()
    rerender(<Banner showIcon={false}>Texto</Banner>)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('renderiza a ação', () => {
    render(<Banner action={<button type="button">Saiba mais</button>}>Texto</Banner>)
    expect(screen.getByRole('button', { name: 'Saiba mais' })).toBeInTheDocument()
  })

  it('com onDismiss, mostra o botão de fechar e o chama ao clicar', async () => {
    const onDismiss = vi.fn()
    const { rerender } = render(<Banner>Texto</Banner>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    rerender(<Banner onDismiss={onDismiss}>Texto</Banner>)
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('mescla className e repassa props HTML', () => {
    render(
      <Banner className="iu:mt-4" data-testid="b">
        Texto
      </Banner>,
    )
    expect(screen.getByTestId('b')).toHaveClass('iu:mt-4', 'iu:w-full')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <Banner status="warning" onDismiss={() => {}} action={<a href="/">Ver</a>}>
        Texto
      </Banner>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
