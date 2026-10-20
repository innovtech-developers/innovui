import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Tag } from './tag'

describe('Tag', () => {
  it('renderiza o texto, filled por padrão', () => {
    render(<Tag>Design</Tag>)
    expect(screen.getByText('Design')).toHaveClass('iu:bg-[var(--color-bg-secondary)]')
  })

  it('no estilo outline, tem borda e não tem fundo', () => {
    render(<Tag variant="outline">Design</Tag>)
    const tag = screen.getByText('Design')
    expect(tag).toHaveClass('iu:inset-ring')
    expect(tag).not.toHaveClass('iu:bg-[var(--color-bg-secondary)]')
  })

  it('não mostra botão de remoção sem onDismiss', () => {
    render(<Tag>Design</Tag>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('com onDismiss, mostra o botão e o chama ao clicar', async () => {
    const onDismiss = vi.fn()
    render(<Tag onDismiss={onDismiss}>Design</Tag>)
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('permite trocar o nome acessível do botão de remoção', () => {
    render(
      <Tag onDismiss={() => {}} dismissLabel="Remover filtro Design">
        Design
      </Tag>,
    )
    expect(screen.getByRole('button', { name: 'Remover filtro Design' })).toBeInTheDocument()
  })

  it('mescla className e repassa props HTML', () => {
    render(
      <Tag className="iu:mt-4" data-testid="t">
        Design
      </Tag>,
    )
    expect(screen.getByTestId('t')).toHaveClass('iu:mt-4', 'iu:rounded-sm')
  })

  it('não tem violações de acessibilidade, com e sem remoção', async () => {
    const { container } = render(
      <>
        <Tag>Design</Tag>
        <Tag variant="outline" onDismiss={() => {}}>
          Código
        </Tag>
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
