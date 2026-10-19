import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { type ToastOptions, ToastProvider, useToast } from './toast'

function Trigger({ options }: { options: ToastOptions }) {
  const { toast, dismiss } = useToast()
  return (
    <>
      <button type="button" onClick={() => toast(options)}>
        disparar
      </button>
      <button type="button" onClick={() => dismiss(0)}>
        fechar-0
      </button>
    </>
  )
}

function setup(options: ToastOptions) {
  return render(
    <ToastProvider>
      <Trigger options={options} />
    </ToastProvider>,
  )
}

describe('Toast', () => {
  beforeAll(() => {
    // jsdom não implementa; o Radix Toast usa nos gestos de swipe.
    window.HTMLElement.prototype.hasPointerCapture = vi.fn()
  })

  it('não mostra nada até alguém chamar toast()', () => {
    setup({ description: 'Salvo' })
    expect(screen.queryByText('Salvo')).not.toBeInTheDocument()
  })

  it('mostra título e descrição ao disparar', async () => {
    setup({ status: 'success', title: 'Pronto', description: 'Alterações salvas.' })
    await userEvent.click(screen.getByText('disparar'))
    expect(await screen.findByText('Pronto')).toBeInTheDocument()
    expect(screen.getByText('Alterações salvas.')).toBeInTheDocument()
  })

  it('funciona sem título e com status info por padrão', async () => {
    setup({ description: 'Só a descrição' })
    await userEvent.click(screen.getByText('disparar'))
    expect(await screen.findByText('Só a descrição')).toBeInTheDocument()
  })

  it('acumula vários toasts', async () => {
    setup({ description: 'Mensagem' })
    await userEvent.click(screen.getByText('disparar'))
    await userEvent.click(screen.getByText('disparar'))
    expect(await screen.findAllByText('Mensagem')).toHaveLength(2)
  })

  it('o botão de fechar remove o toast', async () => {
    setup({ description: 'Mensagem' })
    await userEvent.click(screen.getByText('disparar'))
    await userEvent.click(await screen.findByRole('button', { name: 'Fechar' }))
    expect(screen.queryByText('Mensagem')).not.toBeInTheDocument()
  })

  it('dismiss(id) remove o toast por código', async () => {
    setup({ description: 'Mensagem' })
    await userEvent.click(screen.getByText('disparar'))
    expect(await screen.findByText('Mensagem')).toBeInTheDocument()
    await userEvent.click(screen.getByText('fechar-0'))
    expect(screen.queryByText('Mensagem')).not.toBeInTheDocument()
  })

  it('a ação chama onClick e fecha o toast', async () => {
    const onClick = vi.fn()
    setup({ description: 'Item removido', action: { label: 'Desfazer', onClick } })
    await userEvent.click(screen.getByText('disparar'))
    await userEvent.click(await screen.findByRole('button', { name: 'Desfazer' }))
    expect(onClick).toHaveBeenCalledOnce()
    expect(screen.queryByText('Item removido')).not.toBeInTheDocument()
  })

  it('fecha sozinho depois da duração', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      setup({ description: 'Some logo', duration: 1000 })
      await userEvent.click(screen.getByText('disparar'))
      expect(await screen.findByText('Some logo')).toBeInTheDocument()
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500)
      })
      expect(screen.queryByText('Some logo')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('useToast fora do ToastProvider lança erro claro', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Trigger options={{ description: 'x' }} />)).toThrow(
      'useToast precisa estar dentro de <ToastProvider>.',
    )
    spy.mockRestore()
  })

  it('a região de notificações tem nome acessível', () => {
    setup({ description: 'x' })
    expect(screen.getByRole('region', { name: 'Notificações (F8)' })).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = setup({
      status: 'error',
      title: 'Falha',
      description: 'Não foi possível salvar.',
      action: { label: 'Tentar de novo', onClick: () => {} },
    })
    await userEvent.click(screen.getByText('disparar'))
    await screen.findByText('Falha')
    expect(await axe(container)).toHaveNoViolations()
  })
})
