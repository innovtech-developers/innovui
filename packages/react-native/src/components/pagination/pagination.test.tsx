import { fireEvent, render, screen } from '@testing-library/react-native'
import { getPages, Pagination } from './pagination'

describe('getPages', () => {
  it('mostra todas quando cabem', () => {
    expect(getPages(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(getPages(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('no começo, agrupa as primeiras e abre reticências à direita', () => {
    expect(getPages(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-right', 20])
  })

  it('no meio, reticências dos dois lados', () => {
    expect(getPages(10, 20)).toEqual([1, 'ellipsis-left', 9, 10, 11, 'ellipsis-right', 20])
  })

  it('no fim, abre reticências à esquerda', () => {
    expect(getPages(20, 20)).toEqual([1, 'ellipsis-left', 16, 17, 18, 19, 20])
  })

  it('mantém o mesmo número de itens', () => {
    const sizes = new Set([1, 3, 4, 10, 17, 18, 20].map((p) => getPages(p, 20).length))
    expect(sizes.size).toBe(1)
  })

  it('siblingCount muda a quantidade de vizinhas', () => {
    expect(getPages(10, 30, 2)).toEqual([
      1,
      'ellipsis-left',
      8,
      9,
      10,
      11,
      12,
      'ellipsis-right',
      30,
    ])
  })

  it('uma página só ou nenhuma', () => {
    expect(getPages(1, 1)).toEqual([1])
    expect(getPages(1, 0)).toEqual([])
  })
})

describe('Pagination', () => {
  it('é um grupo nomeado com a página atual marcada', () => {
    render(<Pagination page={2} pageCount={5} onPageChange={() => {}} />)
    expect(screen.getByLabelText('Paginação')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Página 2' }).props.accessibilityState).toMatchObject(
      { selected: true },
    )
    expect(screen.getByRole('button', { name: 'Página 3' }).props.accessibilityState).toMatchObject(
      { selected: false },
    )
    expect(screen.getByText('2').props.className).toContain('text-button-primary-text')
  })

  it('tocar numa página chama onPageChange com o número', () => {
    const onPageChange = jest.fn()
    render(<Pagination page={1} pageCount={5} onPageChange={onPageChange} />)
    fireEvent.press(screen.getByRole('button', { name: 'Página 4' }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('anterior e próxima andam uma página', () => {
    const onPageChange = jest.fn()
    render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />)
    fireEvent.press(screen.getByRole('button', { name: 'Página anterior' }))
    fireEvent.press(screen.getByRole('button', { name: 'Próxima página' }))
    expect(onPageChange).toHaveBeenNthCalledWith(1, 2)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 4)
  })

  it('desabilita anterior na primeira página e próxima na última', () => {
    const onPageChange = jest.fn()
    const { rerender } = render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
    fireEvent.press(screen.getByRole('button', { name: 'Página anterior' }))
    expect(onPageChange).not.toHaveBeenCalled()
    rerender(<Pagination page={3} pageCount={3} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeDisabled()
  })

  it('mostra reticências com muitas páginas', () => {
    render(<Pagination page={10} pageCount={20} onPageChange={() => {}} />)
    expect(screen.getAllByText('…', { includeHiddenElements: true })).toHaveLength(2)
  })

  it('rótulos configuráveis e className', () => {
    render(
      <Pagination
        page={2}
        pageCount={3}
        onPageChange={() => {}}
        previousLabel="Anterior"
        nextLabel="Seguinte"
        accessibilityLabel="Páginas"
        className="justify-center"
        testID="root"
      />,
    )
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Seguinte' })).toBeTruthy()
    expect(screen.getByLabelText('Páginas')).toBeTruthy()
    expect(screen.getByTestId('root').props.className).toContain('justify-center')
  })
})
