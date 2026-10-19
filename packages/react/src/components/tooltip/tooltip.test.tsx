import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { beforeAll, describe, expect, it } from 'vitest'
import { Tooltip } from './tooltip'

beforeAll(() => {
  // jsdom não implementa; o Radix Popper usa para posicionar o tooltip.
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('Tooltip', () => {
  it('não aparece até o trigger receber foco', async () => {
    render(
      <Tooltip content="Salvar alterações">
        <button type="button">Salvar</button>
      </Tooltip>,
    )
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    await userEvent.tab()
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Salvar alterações')
  })

  it('aparece no hover, depois do atraso', async () => {
    render(
      <Tooltip content="Dica" delayDuration={0}>
        <button type="button">Alvo</button>
      </Tooltip>,
    )
    await userEvent.hover(screen.getByRole('button'))
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Dica')
  })

  it('liga o trigger ao tooltip por aria-describedby', async () => {
    render(
      <Tooltip content="Dica">
        <button type="button">Alvo</button>
      </Tooltip>,
    )
    await userEvent.tab()
    await screen.findByRole('tooltip')
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby')
  })

  it('mostra o título acima do texto quando informado', async () => {
    render(
      <Tooltip title="Atalho" content="Ctrl + S">
        <button type="button">Salvar</button>
      </Tooltip>,
    )
    await userEvent.tab()
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveTextContent('AtalhoCtrl + S')
  })

  it('fecha com Esc', async () => {
    render(
      <Tooltip content="Dica">
        <button type="button">Alvo</button>
      </Tooltip>,
    )
    await userEvent.tab()
    await screen.findByRole('tooltip')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('usa o visual do Figma: fundo inverso, raio sm e largura máxima de 240px', async () => {
    render(
      <Tooltip content="Dica" side="bottom" open>
        <button type="button">Alvo</button>
      </Tooltip>,
    )
    const content = document.querySelector('[data-side="bottom"]')
    expect(content).toHaveClass(
      'iu:bg-[var(--color-bg-inverse)]',
      'iu:rounded-sm',
      'iu:max-w-[240px]',
    )
  })

  it('mostra a seta por padrão e a esconde com showArrow={false}', () => {
    const { rerender } = render(
      <Tooltip content="Dica" open>
        <button type="button">Alvo</button>
      </Tooltip>,
    )
    expect(document.querySelector('svg')).toBeInTheDocument()
    rerender(
      <Tooltip content="Dica" open showArrow={false}>
        <button type="button">Alvo</button>
      </Tooltip>,
    )
    expect(document.querySelector('svg')).not.toBeInTheDocument()
  })

  it('mescla className', () => {
    render(
      <Tooltip content="Dica" open className="iu:mt-2">
        <button type="button">Alvo</button>
      </Tooltip>,
    )
    expect(document.querySelector('[data-side]')).toHaveClass('iu:mt-2')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <Tooltip content="Salvar alterações" open>
        <button type="button">Salvar</button>
      </Tooltip>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
