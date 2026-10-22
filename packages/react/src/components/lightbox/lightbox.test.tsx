import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Lightbox } from './lightbox'

const items = [
  { src: '/estrada.jpg', alt: 'Estrada entre montanhas' },
  { src: '/ceu.jpg', alt: 'Céu estrelado' },
  { src: '/cha.jpg', alt: 'Chá e livro' },
]

describe('Lightbox', () => {
  it('não renderiza nada fechado', () => {
    render(<Lightbox items={items} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mostra a foto, o contador e o nome acessível do diálogo', () => {
    render(<Lightbox items={items} open />)
    expect(screen.getByRole('dialog', { name: 'Visualizador de imagens' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Estrada entre montanhas' })).toHaveAttribute(
      'src',
      '/estrada.jpg',
    )
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('as setas avançam e voltam, dando a volta nas pontas', async () => {
    render(<Lightbox items={items} open />)
    await userEvent.click(screen.getByRole('button', { name: 'Foto anterior' }))
    expect(screen.getByRole('img', { name: 'Chá e livro' })).toBeInTheDocument()
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Próxima foto' }))
    expect(screen.getByRole('img', { name: 'Estrada entre montanhas' })).toBeInTheDocument()
  })

  it('as setas do teclado trocam a foto', async () => {
    const onIndexChange = vi.fn()
    render(<Lightbox items={items} open onIndexChange={onIndexChange} />)
    await userEvent.keyboard('{ArrowRight}')
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(onIndexChange).toHaveBeenLastCalledWith(2)
  })

  it('no modo controlado a foto segue `index`', async () => {
    const onIndexChange = vi.fn()
    const { rerender } = render(
      <Lightbox items={items} open index={1} onIndexChange={onIndexChange} />,
    )
    expect(screen.getByRole('img', { name: 'Céu estrelado' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Próxima foto' }))
    expect(onIndexChange).toHaveBeenCalledWith(2)
    // sem o pai atualizar o índice, a foto não muda
    expect(screen.getByRole('img', { name: 'Céu estrelado' })).toBeInTheDocument()
    rerender(<Lightbox items={items} open index={2} onIndexChange={onIndexChange} />)
    expect(screen.getByRole('img', { name: 'Chá e livro' })).toBeInTheDocument()
  })

  it('Esc e o botão de fechar chamam onOpenChange(false)', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox items={items} open onOpenChange={onOpenChange} />)
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
    onOpenChange.mockClear()
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('clicar no fundo fecha, mas clicar na foto não', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox items={items} open onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('img', { name: 'Estrada entre montanhas' }))
    expect(onOpenChange).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('dialog'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('amplia a foto pela proporção real dela (4:3 até carregar)', () => {
    render(<Lightbox items={items} open />)
    const photo = screen.getByRole('img', { name: 'Estrada entre montanhas' })
    expect(photo.style.aspectRatio).toMatch(/^1\.3333\d* \/ 1$/)
    Object.defineProperty(photo, 'naturalWidth', { configurable: true, value: 1600 })
    Object.defineProperty(photo, 'naturalHeight', { configurable: true, value: 900 })
    fireEvent.load(photo)
    expect(photo.style.getPropertyValue('--iu-ratio')).toBe(String(1600 / 900))
    expect(Number.parseFloat(photo.style.aspectRatio)).toBeCloseTo(1600 / 900, 5)
  })

  it('trocar de foto não herda a proporção da anterior', () => {
    render(<Lightbox items={items} open />)
    const first = screen.getByRole('img', { name: 'Estrada entre montanhas' })
    Object.defineProperty(first, 'naturalWidth', { configurable: true, value: 900 })
    Object.defineProperty(first, 'naturalHeight', { configurable: true, value: 1600 })
    fireEvent.load(first)
    fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }))
    const next = screen.getByRole('img', { name: 'Céu estrelado' })
    expect(next.style.aspectRatio).toMatch(/^1\.3333\d* \/ 1$/)
  })

  it('imagem sem dimensões (ainda não decodificada) não quebra a proporção', () => {
    render(<Lightbox items={items} open />)
    const photo = screen.getByRole('img', { name: 'Estrada entre montanhas' })
    fireEvent.load(photo)
    expect(photo.style.aspectRatio).toMatch(/^1\.3333\d* \/ 1$/)
  })

  it('com uma só foto não mostra setas nem contador', () => {
    render(<Lightbox items={items.slice(0, 1)} open />)
    expect(screen.queryByRole('button', { name: 'Próxima foto' })).not.toBeInTheDocument()
    expect(screen.queryByText(/\//)).not.toBeInTheDocument()
  })

  it('aceita rótulos próprios', () => {
    render(
      <Lightbox
        items={items}
        open
        label="Fotos"
        closeLabel="Sair"
        previousLabel="Voltar"
        nextLabel="Avançar"
      />,
    )
    expect(screen.getByRole('dialog', { name: 'Fotos' })).toBeInTheDocument()
    for (const name of ['Sair', 'Voltar', 'Avançar']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
  })

  it('não tem violações de acessibilidade', async () => {
    render(<Lightbox items={items} open />)
    expect(await axe(screen.getByRole('dialog'))).toHaveNoViolations()
  })
})
