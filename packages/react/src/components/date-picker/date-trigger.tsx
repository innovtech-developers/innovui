import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'
import { inputVariants } from '../input/input'

type DateTriggerProps = Omit<ComponentProps<'button'>, 'children'> &
  Parameters<typeof inputVariants>[0] & {
    /** Texto da data; sem ele, mostra o placeholder. */
    text?: string
    placeholder: string
    readOnly?: boolean
  }

/** Botão no estilo do Input que mostra a data e abre o calendário (não faz parte da API pública). */
export function DateTrigger({
  className,
  size,
  error,
  text,
  placeholder,
  readOnly,
  ...props
}: DateTriggerProps) {
  return (
    <button
      type="button"
      aria-invalid={error || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        inputVariants({ size, error }),
        'iu:flex iu:cursor-pointer iu:items-center iu:justify-between iu:gap-2 iu:text-left iu:data-[readonly]:cursor-default iu:data-[readonly]:border-transparent iu:data-[readonly]:bg-[var(--color-field-bg-disabled)]',
        !text && 'iu:text-[var(--color-field-text-placeholder)]',
        className,
      )}
      {...props}
    >
      <span>{text ?? placeholder}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="iu:size-5 iu:shrink-0 iu:text-[var(--color-field-text-placeholder)]"
      >
        <path d="M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      </svg>
    </button>
  )
}
