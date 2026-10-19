import type { ComponentProps } from 'react'

export type Status = 'success' | 'error' | 'warning' | 'info' | 'neutral'

/** Só a cor de destaque (texto/ícone) por status. */
export const statusText: Record<Status, string> = {
  success: 'iu:text-[var(--color-status-success-text)]',
  error: 'iu:text-[var(--color-status-error-text)]',
  warning: 'iu:text-[var(--color-status-warning-text)]',
  info: 'iu:text-[var(--color-status-info-text)]',
  neutral: 'iu:text-[var(--color-status-neutral-text)]',
}

/** Fundo e cor de destaque por status, compartilhados por Alert e Banner (uso interno). */
export const statusSurface: Record<Status, string> = {
  success: 'iu:bg-[var(--color-status-success-bg)] iu:text-[var(--color-status-success-text)]',
  error: 'iu:bg-[var(--color-status-error-bg)] iu:text-[var(--color-status-error-text)]',
  warning: 'iu:bg-[var(--color-status-warning-bg)] iu:text-[var(--color-status-warning-text)]',
  info: 'iu:bg-[var(--color-status-info-bg)] iu:text-[var(--color-status-info-text)]',
  neutral: 'iu:bg-[var(--color-status-neutral-bg)] iu:text-[var(--color-status-neutral-text)]',
}

/** Erro e aviso interrompem o leitor de tela (alert); o resto é anunciado com calma (status). */
export const statusRole = (status: Status) =>
  status === 'error' || status === 'warning' ? 'alert' : 'status'

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const statusGlyph: Record<Status, string> = {
  success: 'M7.5 10L9.16667 11.6667L12.5 8.33333',
  error: 'M10 6.66667V10M10 13.3333H10.0083',
  warning: 'M10 6.66667V10M10 13.3333H10.0083',
  info: 'M10 10V13.3333M10 6.66667H10.0083',
  neutral: 'M10 10V13.3333M10 6.66667H10.0083',
}

/** Ícone semântico de 20px; herda a cor do texto (currentColor). */
export function StatusIcon({ status, ...props }: { status: Status } & ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" {...strokeProps} {...props}>
      <circle cx="10" cy="10" r="7.3333" />
      <path d={statusGlyph[status]} />
    </svg>
  )
}

/** × de 16px; herda a cor do texto (currentColor). */
export function CloseIcon(props: ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" {...strokeProps} {...props}>
      <path d="M12 4L4 12M4 4L12 12" />
    </svg>
  )
}
