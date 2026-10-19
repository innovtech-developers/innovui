import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { IconButton } from './icon-button'

const icon = <svg data-testid="icon" aria-hidden="true" />

describe('IconButton', () => {
  it('usa o aria-label como nome acessível', () => {
    render(<IconButton aria-label="Fechar">{icon}</IconButton>)
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
  })

  it('usa type="button" por padrão e aceita type="submit"', () => {
    const { rerender } = render(<IconButton aria-label="Ação">{icon}</IconButton>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    rerender(
      <IconButton aria-label="Ação" type="submit">
        {icon}
      </IconButton>,
    )
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('dispara onClick e respeita disabled', async () => {
    const onClick = vi.fn()
    const { rerender } = render(
      <IconButton aria-label="Ação" onClick={onClick}>
        {icon}
      </IconButton>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()

    rerender(
      <IconButton aria-label="Ação" disabled onClick={onClick}>
        {icon}
      </IconButton>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('no estado loading, desabilita, marca aria-busy e troca o ícone por um spinner', () => {
    render(
      <IconButton aria-label="Salvar" loading>
        {icon}
      </IconButton>,
    )
    const button = screen.getByRole('button', { name: 'Salvar' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Carregando' })).toBeInTheDocument()
  })

  it.each([
    ['lg', 'iu:size-14', 'iu:size-6'],
    ['md', 'iu:size-11', 'iu:size-5'],
    ['sm', 'iu:size-9', 'iu:size-4'],
  ] as const)('no tamanho %s, é quadrado e o spinner acompanha', (size, box, spinner) => {
    render(
      <IconButton aria-label="Ação" size={size} loading>
        {icon}
      </IconButton>,
    )
    expect(screen.getByRole('button')).toHaveClass(box)
    expect(screen.getByRole('status')).toHaveClass(spinner)
  })

  it('usa o tamanho md por padrão no spinner', () => {
    render(
      <IconButton aria-label="Ação" loading>
        {icon}
      </IconButton>,
    )
    expect(screen.getByRole('status')).toHaveClass('iu:size-5')
  })

  it.each(['primary', 'secondary', 'tertiary', 'ghost', 'destructive'] as const)(
    'renderiza a variante %s',
    (variant) => {
      render(
        <IconButton aria-label="Ação" variant={variant}>
          {icon}
        </IconButton>,
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    },
  )

  it('mescla className customizada sem perder as classes de variante', () => {
    render(
      <IconButton aria-label="Ação" className="iu:mt-4">
        {icon}
      </IconButton>,
    )
    expect(screen.getByRole('button')).toHaveClass('iu:mt-4', 'iu:rounded-full')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<IconButton aria-label="Fechar">{icon}</IconButton>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('não tem violações de acessibilidade no estado loading', async () => {
    const { container } = render(
      <IconButton aria-label="Salvar" loading>
        {icon}
      </IconButton>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
