import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Slider } from './slider'

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('Slider', () => {
  it('é um slider com nome, valor e limites', () => {
    render(<Slider aria-label="Volume" defaultValue={[40]} min={0} max={100} />)
    const thumb = screen.getByRole('slider', { name: 'Volume' })
    expect(thumb).toHaveAttribute('aria-valuenow', '40')
    expect(thumb).toHaveAttribute('aria-valuemin', '0')
    expect(thumb).toHaveAttribute('aria-valuemax', '100')
  })

  it('sem valor inicial começa no mínimo', () => {
    render(<Slider aria-label="Volume" min={10} max={50} />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '10')
  })

  it('setas mudam o valor pelo step e avisam onValueChange', async () => {
    const onValueChange = vi.fn()
    render(
      <Slider aria-label="Volume" defaultValue={[40]} step={5} onValueChange={onValueChange} />,
    )
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    expect(onValueChange).toHaveBeenLastCalledWith([45])
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(onValueChange).toHaveBeenLastCalledWith([35])
    await userEvent.keyboard('{Home}')
    expect(onValueChange).toHaveBeenLastCalledWith([0])
    await userEvent.keyboard('{End}')
    expect(onValueChange).toHaveBeenLastCalledWith([100])
  })

  it('com dois valores é um intervalo: duas alças, nomeadas com o número', () => {
    render(<Slider aria-label="Preço" defaultValue={[20, 80]} />)
    expect(screen.getByRole('slider', { name: 'Preço 1' })).toHaveAttribute('aria-valuenow', '20')
    expect(screen.getByRole('slider', { name: 'Preço 2' })).toHaveAttribute('aria-valuenow', '80')
  })

  it('thumbLabels dá nomes próprios às alças', () => {
    render(<Slider aria-label="Preço" defaultValue={[20, 80]} thumbLabels={['Mínimo', 'Máximo']} />)
    expect(screen.getByRole('slider', { name: 'Mínimo' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Máximo' })).toBeInTheDocument()
  })

  it('funciona controlado', () => {
    const { rerender } = render(<Slider aria-label="Volume" value={[30]} />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '30')
    rerender(<Slider aria-label="Volume" value={[70]} />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '70')
  })

  it('desabilitado não responde ao teclado', async () => {
    const onValueChange = vi.fn()
    render(
      <Slider aria-label="Volume" defaultValue={[40]} disabled onValueChange={onValueChange} />,
    )
    const thumb = screen.getByRole('slider')
    expect(thumb).toHaveAttribute('data-disabled')
    thumb.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('className chega à raiz', () => {
    const { container } = render(<Slider aria-label="Volume" className="iu:max-w-xs" />)
    expect(container.firstChild).toHaveClass('iu:max-w-xs')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <>
        <Slider aria-label="Volume" defaultValue={[40]} />
        <Slider aria-label="Preço" defaultValue={[20, 80]} />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
