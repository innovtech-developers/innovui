'use client'

import { type ComponentProps, type DragEvent, type ReactNode, useState } from 'react'
import { cn } from '../../utils/cn'

export type UploadProps = Omit<
  ComponentProps<'input'>,
  'type' | 'onChange' | 'value' | 'defaultValue' | 'size' | 'children' | 'title'
> & {
  /** Chamado com os arquivos escolhidos (pelo seletor ou arrastados). */
  onFilesChange: (files: File[]) => void
  /** Texto principal da área. */
  title?: ReactNode
  /** Texto de apoio (formatos e tamanho aceitos, por exemplo). */
  description?: ReactNode
  /** Borda em vermelho, para quando os arquivos escolhidos têm problema. */
  error?: boolean
}

/** Confere o arquivo contra o `accept` do input (".pdf", "image/*", "image/png"), já que arrastar o ignora. */
function matches(file: File, accept?: string) {
  if (!accept) return true
  return accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .some((rule) =>
      rule.startsWith('.')
        ? file.name.toLowerCase().endsWith(rule)
        : rule.endsWith('/*')
          ? file.type.startsWith(rule.slice(0, -1))
          : file.type === rule,
    )
}

/**
 * Área para escolher arquivos clicando ou arrastando. Só captura os arquivos: mostrar a lista,
 * validar tamanho e enviar ao servidor ficam com você.
 */
export function Upload({
  className,
  onFilesChange,
  title = 'Arraste arquivos aqui ou clique para escolher',
  description,
  error,
  disabled,
  multiple,
  accept,
  ...props
}: UploadProps) {
  const [dragging, setDragging] = useState(false)

  function drop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    const files = Array.from(e.dataTransfer.files).filter((file) => matches(file, accept))
    if (files.length > 0) onFilesChange(multiple ? files : files.slice(0, 1))
  }

  return (
    <label
      data-dragging={dragging || undefined}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={drop}
      className={cn(
        'iu:flex iu:cursor-pointer iu:flex-col iu:items-center iu:gap-1 iu:rounded-md iu:border iu:border-dashed iu:border-[var(--color-field-border)] iu:bg-[var(--color-field-bg)] iu:px-6 iu:py-8 iu:text-center iu:transition-colors iu:hover:border-[var(--color-field-border-hover)] iu:has-[input:focus-visible]:border-[var(--color-field-border-hover)] iu:has-[input:focus-visible]:ring-2 iu:has-[input:focus-visible]:ring-[var(--color-field-focus-ring)] iu:data-[dragging]:border-[var(--color-interactive-primary)] iu:data-[dragging]:bg-[var(--color-button-secondary-bg)] iu:has-[input:disabled]:cursor-not-allowed iu:has-[input:disabled]:border-[var(--color-field-border-disabled)] iu:has-[input:disabled]:bg-[var(--color-field-bg-disabled)] iu:has-[input:disabled]:text-[var(--color-field-text-disabled)]',
        error &&
          'iu:border-[var(--color-field-border-error)] iu:hover:border-[var(--color-field-border-error)]',
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="iu:mb-1 iu:size-6 iu:text-[var(--color-text-secondary)]"
      >
        <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
      </svg>
      <span className="iu:text-sm iu:leading-5 iu:font-medium iu:text-[var(--color-text-primary)]">
        {title}
      </span>
      {description && (
        <span className="iu:text-xs iu:leading-4 iu:text-[var(--color-text-secondary)]">
          {description}
        </span>
      )}
      <input
        type="file"
        className="iu:sr-only"
        disabled={disabled}
        multiple={multiple}
        accept={accept}
        aria-invalid={error || undefined}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          // limpa para que escolher o mesmo arquivo de novo também dispare onChange
          e.target.value = ''
          if (files.length > 0) onFilesChange(files)
        }}
        {...props}
      />
    </label>
  )
}
