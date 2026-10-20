import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Avatar } from './avatar'

describe('Avatar', () => {
  it('sem src mostra as iniciais e o nome é o rótulo acessível', () => {
    render(<Avatar name="Ada Lovelace" />)
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL')
  })

  it('uma palavra gera uma inicial; várias usam a primeira e a última', () => {
    const { rerender } = render(<Avatar name="Ada" />)
    expect(screen.getByRole('img')).toHaveTextContent(/^A$/)
    rerender(<Avatar name="  ana maria de souza " />)
    expect(screen.getByRole('img')).toHaveTextContent('AS')
  })

  it('com src mostra a imagem (decorativa, o rótulo fica no contêiner)', () => {
    const { container } = render(<Avatar name="Ada" src="/ada.png" />)
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', '/ada.png')
    expect(img).toHaveAttribute('alt', '')
  })

  it('volta para as iniciais quando a imagem falha', () => {
    const { container } = render(<Avatar name="Ada Lovelace" src="/quebrada.png" />)
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByRole('img')).toHaveTextContent('AL')
  })

  it('detecta a imagem que já falhou antes da hidratação (SSR)', () => {
    const complete = vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true)
    const { container } = render(<Avatar name="Ada Lovelace" src="/quebrada.png" />)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByRole('img')).toHaveTextContent('AL')
    complete.mockRestore()
  })

  it('tenta de novo quando o src muda depois de uma falha', () => {
    const { container, rerender } = render(<Avatar name="Ada" src="/quebrada.png" />)
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    rerender(<Avatar name="Ada" src="/nova.png" />)
    expect(container.querySelector('img')).toHaveAttribute('src', '/nova.png')
  })

  it.each([
    ['sm', 'iu:size-8'],
    ['md', 'iu:size-10'],
    ['lg', 'iu:size-14'],
  ] as const)('tamanho %s aplica %s', (size, cls) => {
    render(<Avatar name="Ada" size={size} />)
    expect(screen.getByRole('img')).toHaveClass(cls)
  })

  it('o padrão é md (40px, como o Skeleton avatar)', () => {
    render(<Avatar name="Ada" />)
    expect(screen.getByRole('img')).toHaveClass('iu:size-10')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" src="/g.png" />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
