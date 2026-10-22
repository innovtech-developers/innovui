import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Carousel, CarouselItem } from './carousel'

const WIDTH = 300 // largura de cada item; a área visível mostra 1,5 item

function setup(props: Partial<React.ComponentProps<typeof Carousel>> = {}) {
  const scrollTo = vi.fn()
  const view = render(
    <Carousel label="Modelos" {...props}>
      {['Boas-vindas', 'Catálogo', 'Pedido', 'Pós-venda'].map((name) => (
        <CarouselItem key={name}>{name}</CarouselItem>
      ))}
    </Carousel>,
  )
  const track = screen.getByRole('region', { name: 'Modelos' }).firstElementChild as HTMLElement
  screen.getAllByRole('group').forEach((item, i) => {
    Object.defineProperty(item, 'offsetLeft', { configurable: true, value: i * WIDTH })
  })
  Object.defineProperty(track, 'scrollWidth', { configurable: true, value: 4 * WIDTH })
  Object.defineProperty(track, 'clientWidth', { configurable: true, value: 450 })
  track.scrollTo = scrollTo as unknown as typeof track.scrollTo
  const scrollTrack = (left: number) => {
    track.scrollLeft = left
    fireEvent.scroll(track)
  }
  return { ...view, track, scrollTo, scrollTrack }
}

describe('Carousel', () => {
  it('expõe a região, os slides e um ponto por item', () => {
    setup()
    expect(screen.getByRole('region', { name: 'Modelos' })).toHaveAttribute(
      'aria-roledescription',
      'carousel',
    )
    expect(screen.getAllByRole('group')).toHaveLength(4)
    expect(screen.getAllByRole('button', { name: /Ir para o item/ })).toHaveLength(4)
  })

  it('começa no primeiro item, com "anterior" desabilitado', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Ir para o item 1' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Item anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Próximo item' })).toBeEnabled()
  })

  it('"próximo" rola até o início do item seguinte', async () => {
    const { scrollTo } = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Próximo item' }))
    expect(scrollTo).toHaveBeenCalledWith({ left: WIDTH, behavior: 'smooth' })
  })

  it('um ponto leva ao item correspondente', async () => {
    const { scrollTo } = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Ir para o item 3' }))
    expect(scrollTo).toHaveBeenCalledWith({ left: 2 * WIDTH, behavior: 'smooth' })
  })

  it('acompanha a rolagem: ponto ativo, onIndexChange e seta desabilitada no fim', () => {
    const onIndexChange = vi.fn()
    const { scrollTrack } = setup({ onIndexChange })
    scrollTrack(WIDTH)
    expect(screen.getByRole('button', { name: 'Ir para o item 2' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
    expect(screen.getByRole('button', { name: 'Item anterior' })).toBeEnabled()

    // o fim da rolagem (900 de 900 - 450 = 750) vale como último item, mesmo sem alinhar à esquerda
    scrollTrack(4 * WIDTH - 450)
    expect(screen.getByRole('button', { name: 'Ir para o item 4' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Próximo item' })).toBeDisabled()
    expect(onIndexChange).toHaveBeenLastCalledWith(3)
  })

  it('um onIndexChange inline (novo a cada render) não é chamado de novo sem o item mudar', () => {
    const calls: number[] = []
    const { scrollTrack } = setup({ onIndexChange: (index) => calls.push(index) })
    scrollTrack(WIDTH)
    expect(calls).toEqual([1])
    scrollTrack(WIDTH + 10) // mesmo item; o pai re-renderiza com outra função
    expect(calls).toEqual([1])
  })

  it('setas do teclado, Home e End navegam com o foco na trilha', async () => {
    const { track, scrollTo } = setup()
    track.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(scrollTo).toHaveBeenLastCalledWith({ left: WIDTH, behavior: 'smooth' })
    await userEvent.keyboard('{End}')
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 3 * WIDTH, behavior: 'smooth' })
    await userEvent.keyboard('{Home}')
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'smooth' })
  })

  it('arrastar com o mouse move a rolagem e encaixa no item mais perto ao soltar', () => {
    const { track, scrollTo } = setup()
    fireEvent.pointerDown(track, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 200 })
    fireEvent.pointerMove(track, { pointerId: 1, pointerType: 'mouse', clientX: 50 })
    expect(track.scrollLeft).toBe(150)
    track.scrollLeft = 310
    fireEvent.pointerUp(track, { pointerId: 1, pointerType: 'mouse' })
    return Promise.resolve().then(() => {
      expect(scrollTo).toHaveBeenLastCalledWith({ left: WIDTH, behavior: 'smooth' })
    })
  })

  it('um toque curto (sem arrasto) não mexe na rolagem', () => {
    const { track, scrollTo } = setup()
    fireEvent.pointerDown(track, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 200 })
    fireEvent.pointerMove(track, { pointerId: 1, pointerType: 'mouse', clientX: 198 })
    fireEvent.pointerUp(track, { pointerId: 1, pointerType: 'mouse' })
    expect(track.scrollLeft).toBe(0)
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('pode esconder os pontos e as setas', () => {
    const { rerender } = setup({ showDots: false })
    expect(screen.queryByRole('button', { name: /Ir para o item/ })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Próximo item' })).toBeInTheDocument()
    rerender(
      <Carousel label="Modelos" showArrows={false}>
        <CarouselItem>Um</CarouselItem>
      </Carousel>,
    )
    expect(screen.queryByRole('button', { name: 'Próximo item' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ir para o item 1' })).toBeInTheDocument()
  })

  it('aceita rótulos próprios nas setas e nos pontos', () => {
    setup({ previousLabel: 'Voltar', nextLabel: 'Avançar', dotLabel: (i) => `Modelo ${i + 1}` })
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Avançar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Modelo 2' })).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = setup()
    expect(await axe(container)).toHaveNoViolations()
  })
})
