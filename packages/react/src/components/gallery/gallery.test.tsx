import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Gallery } from './gallery'

const items = [
  { src: '/estrada.jpg', alt: 'Estrada entre montanhas', thumbSrc: '/estrada-p.jpg' },
  { src: '/ceu.jpg', alt: 'Céu estrelado' },
  { src: '/cha.jpg', alt: 'Chá e livro' },
]

describe('Gallery', () => {
  it('lista uma miniatura por foto, com nome acessível', () => {
    render(<Gallery items={items} aria-label="Anexos" />)
    expect(
      within(screen.getByRole('list', { name: 'Anexos' })).getAllByRole('listitem'),
    ).toHaveLength(3)
    expect(
      screen.getByRole('button', { name: 'Ampliar foto 1: Estrada entre montanhas' }),
    ).toBeInTheDocument()
  })

  it('usa thumbSrc na grade e cai para src sem ele', () => {
    const { container } = render(<Gallery items={items} />)
    const imgs = [...container.querySelectorAll('img')]
    expect(imgs.map((img) => img.getAttribute('src'))).toEqual([
      '/estrada-p.jpg',
      '/ceu.jpg',
      '/cha.jpg',
    ])
  })

  it('clicar numa miniatura abre o lightbox naquela foto', async () => {
    render(<Gallery items={items} />)
    await userEvent.click(screen.getByRole('button', { name: /Ampliar foto 2/ }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('img', { name: 'Céu estrelado' })).toHaveAttribute(
      'src',
      '/ceu.jpg',
    )
    expect(within(dialog).getByText('2 / 3')).toBeInTheDocument()
  })

  it('ao fechar, o foco vai para a miniatura da foto em que o usuário parou', async () => {
    render(<Gallery items={items} />)
    await userEvent.click(screen.getByRole('button', { name: /Ampliar foto 1/ }))
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Ampliar foto 2/ })).toHaveFocus(),
    )
  })

  it('aceita rótulos próprios', async () => {
    render(
      <Gallery
        items={items}
        openLabel={(item) => `Abrir ${item.alt}`}
        lightboxLabel="Anexos ampliados"
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Abrir Chá e livro' }))
    expect(await screen.findByRole('dialog', { name: 'Anexos ampliados' })).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Gallery items={items} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
