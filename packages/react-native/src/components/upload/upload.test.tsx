import { fireEvent, render, screen } from '@testing-library/react-native'
import { Upload, type UploadFile } from './upload'

const area = () => screen.getAllByRole('button')[0] as ReturnType<typeof screen.getByRole>

describe('Upload', () => {
  it('mostra o texto padrão e a descrição', () => {
    render(<Upload onPick={() => {}} description="PDF até 5 MB" />)
    expect(screen.getByText('Toque para escolher arquivos')).toBeTruthy()
    expect(screen.getByText('PDF até 5 MB')).toBeTruthy()
    expect(area().props.accessibilityLabel).toBe('Toque para escolher arquivos. PDF até 5 MB')
  })

  it('o título é configurável', () => {
    render(<Upload onPick={() => {}} title="Anexe o comprovante" />)
    expect(screen.getByText('Anexe o comprovante')).toBeTruthy()
  })

  it('tocar na área chama onPick', () => {
    const onPick = jest.fn()
    render(<Upload onPick={onPick} />)
    fireEvent.press(area())
    expect(onPick).toHaveBeenCalledTimes(1)
  })

  it('disabled não chama onPick e usa o visual desabilitado', () => {
    const onPick = jest.fn()
    render(<Upload onPick={onPick} disabled />)
    fireEvent.press(area())
    expect(onPick).not.toHaveBeenCalled()
    expect(area().props.accessibilityState.disabled).toBe(true)
    expect(area().props.className).toContain('disabled:bg-field-bg-disabled')
  })

  it('error pinta a borda de vermelho e className vence', () => {
    render(<Upload onPick={() => {}} error className="mt-4" />)
    expect(area().props.className).toContain('border-field-border-error')
    expect(area().props.className).not.toContain('border-field-border ')
    expect(area().props.className).toContain('mt-4')
  })

  describe('lista de arquivos', () => {
    const files: UploadFile[] = [
      { id: '1', name: 'contrato.pdf', size: 1536 * 1024, status: 'done' },
      { id: '2', name: 'foto.png', size: 230 * 1024, status: 'uploading', progress: 40 },
      {
        id: '3',
        name: 'grande.zip',
        size: 12,
        status: 'error',
        errorMessage: 'Arquivo muito grande',
      },
    ]

    it('mostra nome, tamanho formatado, erro, concluído e progresso', () => {
      render(<Upload onPick={() => {}} files={files} />)
      expect(screen.getByText('contrato.pdf')).toBeTruthy()
      expect(screen.getByText('1,5 MB')).toBeTruthy()
      expect(screen.getByText('230 KB')).toBeTruthy()
      expect(screen.getByText('Arquivo muito grande')).toBeTruthy()
      expect(screen.getByText('Arquivo muito grande').props.className).toContain(
        'text-status-error-text',
      )
      expect(screen.getByLabelText('Concluído')).toBeTruthy()
      const bar = screen.getByRole('progressbar')
      expect(bar.props.accessibilityValue).toMatchObject({ min: 0, max: 100, now: 40 })
    })

    it('o × chama onRemoveFile com o id e só existe com o callback', () => {
      const onRemoveFile = jest.fn()
      const { rerender } = render(
        <Upload onPick={() => {}} files={files} onRemoveFile={onRemoveFile} />,
      )
      fireEvent.press(screen.getByRole('button', { name: 'Remover foto.png' }))
      expect(onRemoveFile).toHaveBeenCalledWith('2')
      rerender(<Upload onPick={() => {}} files={files} />)
      expect(screen.queryByRole('button', { name: /Remover/ })).toBeNull()
    })

    it('removeLabel muda o rótulo acessível', () => {
      render(
        <Upload onPick={() => {}} files={files} onRemoveFile={() => {}} removeLabel="Excluir" />,
      )
      expect(screen.getByRole('button', { name: 'Excluir foto.png' })).toBeTruthy()
    })

    it('limita o progresso entre 0 e 100', () => {
      render(
        <Upload
          onPick={() => {}}
          files={[{ id: 'x', name: 'a.txt', status: 'uploading', progress: 250 }]}
        />,
      )
      expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(100)
    })
  })
})
