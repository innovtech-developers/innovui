import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Upload } from './upload'

const pdf = new File(['a'], 'contrato.pdf', { type: 'application/pdf' })
const png = new File(['b'], 'foto.png', { type: 'image/png' })

const area = () =>
  screen.getByText('Arraste arquivos aqui ou clique para escolher').closest('label')

function drop(target: HTMLElement, files: File[]) {
  const event = createEvent.drop(target)
  Object.defineProperty(event, 'dataTransfer', { value: { files } })
  fireEvent(target, event)
}

describe('Upload', () => {
  it('mostra o texto padrão, a descrição e um input de arquivo', () => {
    const { container } = render(<Upload onFilesChange={() => {}} description="PDF até 5 MB" />)
    expect(area()).toBeInTheDocument()
    expect(screen.getByText('PDF até 5 MB')).toBeInTheDocument()
    expect(container.querySelector('input[type="file"]')).toBeInTheDocument()
  })

  it('o título é configurável', () => {
    render(<Upload onFilesChange={() => {}} title="Anexe o comprovante" />)
    expect(screen.getByText('Anexe o comprovante')).toBeInTheDocument()
  })

  it('escolher pelo seletor chama onFilesChange com os arquivos', async () => {
    const onFilesChange = vi.fn()
    const { container } = render(<Upload multiple onFilesChange={onFilesChange} />)
    await userEvent.upload(container.querySelector('input') as HTMLInputElement, [pdf, png])
    expect(onFilesChange).toHaveBeenCalledWith([pdf, png])
  })

  it('limpa o input para o mesmo arquivo poder ser escolhido de novo', async () => {
    const onFilesChange = vi.fn()
    const { container } = render(<Upload onFilesChange={onFilesChange} />)
    const input = container.querySelector('input') as HTMLInputElement
    await userEvent.upload(input, pdf)
    expect(input.value).toBe('')
    await userEvent.upload(input, pdf)
    expect(onFilesChange).toHaveBeenCalledTimes(2)
  })

  it('arrastar e soltar entrega os arquivos', () => {
    const onFilesChange = vi.fn()
    render(<Upload multiple onFilesChange={onFilesChange} />)
    drop(area() as HTMLElement, [pdf, png])
    expect(onFilesChange).toHaveBeenCalledWith([pdf, png])
  })

  it('sem multiple, soltar vários entrega só o primeiro', () => {
    const onFilesChange = vi.fn()
    render(<Upload onFilesChange={onFilesChange} />)
    drop(area() as HTMLElement, [pdf, png])
    expect(onFilesChange).toHaveBeenCalledWith([pdf])
  })

  it('soltar respeita o accept (extensão, tipo exato e curinga)', () => {
    const onFilesChange = vi.fn()
    const { rerender } = render(<Upload accept=".pdf" onFilesChange={onFilesChange} />)
    drop(area() as HTMLElement, [png, pdf])
    expect(onFilesChange).toHaveBeenLastCalledWith([pdf])
    rerender(<Upload accept="image/*" onFilesChange={onFilesChange} />)
    drop(area() as HTMLElement, [pdf, png])
    expect(onFilesChange).toHaveBeenLastCalledWith([png])
    rerender(<Upload accept="application/pdf, image/png" multiple onFilesChange={onFilesChange} />)
    drop(area() as HTMLElement, [pdf, png])
    expect(onFilesChange).toHaveBeenLastCalledWith([pdf, png])
  })

  it('não chama onFilesChange se nenhum arquivo é aceito', () => {
    const onFilesChange = vi.fn()
    render(<Upload accept=".pdf" onFilesChange={onFilesChange} />)
    drop(area() as HTMLElement, [png])
    expect(onFilesChange).not.toHaveBeenCalled()
  })

  it('destaca a área enquanto se arrasta por cima e tira ao sair ou soltar', () => {
    render(<Upload onFilesChange={() => {}} />)
    const label = area() as HTMLElement
    fireEvent.dragOver(label)
    expect(label).toHaveAttribute('data-dragging')
    fireEvent.dragLeave(label)
    expect(label).not.toHaveAttribute('data-dragging')
    fireEvent.dragOver(label)
    drop(label, [pdf])
    expect(label).not.toHaveAttribute('data-dragging')
  })

  it('desabilitado ignora arrastar e soltar', () => {
    const onFilesChange = vi.fn()
    const { container } = render(<Upload disabled onFilesChange={onFilesChange} />)
    const label = area() as HTMLElement
    fireEvent.dragOver(label)
    expect(label).not.toHaveAttribute('data-dragging')
    drop(label, [pdf])
    expect(onFilesChange).not.toHaveBeenCalled()
    expect(container.querySelector('input')).toBeDisabled()
  })

  it('error marca aria-invalid e a borda vermelha', () => {
    const { container } = render(<Upload error onFilesChange={() => {}} />)
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true')
    expect(area()).toHaveClass('iu:border-[var(--color-field-border-error)]')
  })

  it('o input recebe foco por teclado (está só escondido visualmente)', async () => {
    const { container } = render(<Upload onFilesChange={() => {}} />)
    await userEvent.tab()
    expect(container.querySelector('input')).toHaveFocus()
  })

  it('repassa props ao input (name, aria-label) e className à área', () => {
    const { container } = render(
      <Upload onFilesChange={() => {}} name="anexo" aria-label="Anexo" className="iu:py-4" />,
    )
    expect(container.querySelector('input')).toHaveAttribute('name', 'anexo')
    expect(screen.getByLabelText('Anexo')).toBeInTheDocument()
    expect(area()).toHaveClass('iu:py-4')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Upload onFilesChange={() => {}} description="PDF até 5 MB" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
