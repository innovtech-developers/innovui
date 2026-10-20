/// <reference types="uniwind/types" />

import Svg, { Circle, Path, type SvgProps } from 'react-native-svg'

export type Status = 'success' | 'error' | 'warning' | 'info' | 'neutral'

/** Só a cor de destaque (texto/ícone) por status. */
export const statusText: Record<Status, string> = {
  success: 'text-status-success-text',
  error: 'text-status-error-text',
  warning: 'text-status-warning-text',
  info: 'text-status-info-text',
  neutral: 'text-status-neutral-text',
}

/** Fundo por status, compartilhado por Alert e Banner (uso interno). */
export const statusBg: Record<Status, string> = {
  success: 'bg-status-success-bg',
  error: 'bg-status-error-bg',
  warning: 'bg-status-warning-bg',
  info: 'bg-status-info-bg',
  neutral: 'bg-status-neutral-bg',
}

/** Nome do token de cor do texto de cada status, para `useToken` (ícones SVG). */
export const statusTextToken = {
  success: '--color-status-success-text',
  error: '--color-status-error-text',
  warning: '--color-status-warning-text',
  info: '--color-status-info-text',
  neutral: '--color-status-neutral-text',
} as const satisfies Record<Status, `--color-${string}`>

/** Erro e aviso interrompem o leitor de tela (alert); o resto é anunciado com calma. */
export const statusRole = (status: Status) =>
  status === 'error' || status === 'warning' ? 'alert' : undefined

type IconProps = Omit<SvgProps, 'stroke' | 'fill' | 'width' | 'height'> & { color?: string }

const strokeProps = {
  fill: 'none',
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

/** Ícone semântico de 20px, na cor passada em `color`. */
export function StatusIcon({ status, color, ...props }: { status: Status } & IconProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" stroke={color} {...strokeProps} {...props}>
      <Circle cx="10" cy="10" r="7.3333" />
      <Path d={statusGlyph[status]} />
    </Svg>
  )
}

/** × de 16px. */
export function CloseIcon({ color, ...props }: IconProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" stroke={color} {...strokeProps} {...props}>
      <Path d="M12 4L4 12M4 4L12 12" />
    </Svg>
  )
}

/** ✓ de 16px. */
export function CheckIcon({ color, ...props }: IconProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" stroke={color} {...strokeProps} {...props}>
      <Path d="M13.3333 4L6 11.3333L2.66667 8" />
    </Svg>
  )
}

/** › de 12px. */
export function ChevronRightIcon({ color, ...props }: IconProps) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" stroke={color} {...strokeProps} {...props}>
      <Path d="M4.5 9L7.5 6L4.5 3" />
    </Svg>
  )
}
