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

  it('dismissible={false} esconde o botão de fechar', async () => {
    setup({ description: 'Mensagem', dismissible: false })
    await userEvent.click(screen.getByText('disparar'))
    expect(await screen.findByText('Mensagem')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Fechar' })).not.toBeInTheDocument()
  })

  it('showIcon={false} esconde o ícone do status', async () => {
    setup({ description: 'Mensagem', showIcon: false })
    await userEvent.click(screen.getByText('disparar'))
    const toast = (await screen.findByText('Mensagem')).closest('li') as HTMLElement
    expect(toast.querySelector('svg[width="20"]')).toBeNull()
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

  it('depois de clicar na ação, os demais toasts continuam fechando sozinhos', async () => {
    // O Radix pausa os timers quando o foco entra no viewport e só retoma no focusout; ao
    // fechar o toast focado o elemento some sem focusout, e os outros ficavam pausados para sempre.
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      function Two() {
        const { toast } = useToast()
        return (
          <button
            type="button"
            onClick={() => {
              toast({
                description: 'Com ação',
                duration: 1000,
                action: { label: 'Desfazer', onClick: () => {} },
              })
              toast({ description: 'Sem ação', duration: 1000 })
            }}
          >
            dois
          </button>
        )
      }
      render(
        <ToastProvider>
          <Two />
        </ToastProvider>,
      )
      await userEvent.click(screen.getByText('dois'))
      await userEvent.click(await screen.findByRole('button', { name: 'Desfazer' }))
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500)
      })
      expect(screen.queryByText('Sem ação')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('quando um toast sai, os de baixo deslizam para o novo lugar em vez de pular', async () => {
    // jsdom não faz layout: o `offsetTop` vem da posição na lista (80px por toast).
    const animate = vi.fn()
    const top = vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.parentElement ? [...this.parentElement.children].indexOf(this) * 80 : 0
    })
    window.HTMLElement.prototype.animate = animate
    try {
      function Two() {
        const { toast, dismiss } = useToast()
        return (
          <>
            <button
              type="button"
              onClick={() => {
                toast({ description: 'Primeiro' })
                toast({ description: 'Segundo' })
              }}
            >
              dois
            </button>
            <button type="button" onClick={() => dismiss(0)}>
              fechar-0
            </button>
          </>
        )
      }
      render(
        <ToastProvider>
          <Two />
        </ToastProvider>,
      )
      await userEvent.click(screen.getByText('dois'))
      expect(await screen.findByText('Segundo')).toBeInTheDocument()
      expect(animate).not.toHaveBeenCalled()
      await userEvent.click(screen.getByText('fechar-0'))
      expect(animate).toHaveBeenCalledWith([{ translate: '0 80px' }, { translate: '0 0' }], {
        duration: 200,
        easing: 'ease-out',
        composite: 'add',
      })
    } finally {
      top.mockRestore()
      // o jsdom não define `animate`: remove o mock
      delete (window.HTMLElement.prototype as { animate?: unknown }).animate
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
    setup({
      status: 'error',
      title: 'Falha',
      description: 'Não foi possível salvar.',
      action: { label: 'Tentar de novo', onClick: () => {} },
    })
    await userEvent.click(screen.getByText('disparar'))
    await screen.findByText('Falha')
    // O viewport fica no <body> (portal), fora do container do render.
    expect(await axe(document.body)).toHaveNoViolations()
  })

  it('renderiza o viewport no <body>, fora do contêiner do app', async () => {
    const { container } = setup({ description: 'Mensagem' })
    await userEvent.click(screen.getByText('disparar'))
    const message = await screen.findByText('Mensagem')
    expect(container).not.toContainElement(message)
    expect(document.body).toContainElement(message)
  })

  it('aparece no canto superior direito', () => {
    setup({ description: 'x' })
    const viewport = screen
      .getByRole('region', { name: 'Notificações (F8)' })
      .querySelector('ol') as HTMLElement
    expect(viewport).toHaveClass('iu:top-4', 'iu:right-4')
    expect(viewport).not.toHaveClass('iu:bottom-4')
  })

  it('a ação é um Button ghost médio (44px), como no design', async () => {
    setup({ description: 'x', action: { label: 'Desfazer', onClick: () => {} } })
    await userEvent.click(screen.getByText('disparar'))
    const action = await screen.findByRole('button', { name: 'Desfazer' })
    expect(action).toHaveClass('iu:h-11')
    expect(action).not.toHaveClass('iu:h-9')
  })

  it('o cartão usa a superfície elevada com borda e sombra, nos dois temas', async () => {
    setup({ description: 'Mensagem' })
    await userEvent.click(screen.getByText('disparar'))
    const card = (await screen.findByText('Mensagem')).closest('li') as HTMLElement
    expect(card).toHaveClass(
      'iu:bg-[var(--color-surface-elevated)]',
      'iu:border-[var(--color-border-default)]',
      'iu:shadow-md',
    )
  })
})
