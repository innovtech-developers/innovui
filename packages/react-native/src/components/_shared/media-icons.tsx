/// <reference types="uniwind/types" />

import Svg, { Path, Rect, type SvgProps } from 'react-native-svg'

type IconProps = Omit<SvgProps, 'stroke' | 'fill' | 'width' | 'height'> & {
  color?: string
  /** Lado em px. Padrão: 20. */
  size?: number
}

// Ícones do Lucide (viewBox 24); com traço 2.4 saem com 2px aos 20px, como no Figma.
const strokeProps = {
  fill: 'none',
  strokeWidth: 2.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const playPath =
  'M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z'

function Icon({
  color,
  size = 20,
  children,
  ...props
}: IconProps & { fill?: string; children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...strokeProps} {...props}>
      {children}
    </Svg>
  )
}

/** Triângulo de reproduzir; `filled` preenche com `color` (botão central do vídeo). */
export function PlayIcon({ filled, color, ...props }: IconProps & { filled?: boolean }) {
  return (
    <Icon color={color} fill={filled ? color : 'none'} {...props}>
      <Path d={playPath} />
    </Icon>
  )
}

/** Duas barras de pausar; `filled` preenche com `color` (botão central do vídeo). */
export function PauseIcon({ filled, color, ...props }: IconProps & { filled?: boolean }) {
  return (
    <Icon color={color} fill={filled ? color : 'none'} {...props}>
      <Rect x="14" y="3" width="5" height="18" rx="1" />
      <Rect x="5" y="3" width="5" height="18" rx="1" />
    </Icon>
  )
}

export function MaximizeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <Path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <Path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <Path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <Path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </Icon>
  )
}

export function MinimizeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <Path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <Path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <Path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <Path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </Icon>
  )
}

/** Quatro setas para fora: o ícone de ampliar sobre a miniatura. */
export function ExpandIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <Path d="m15 15 6 6" />
      <Path d="m15 9 6-6" />
      <Path d="M21 16v5h-5" />
      <Path d="M21 8V3h-5" />
      <Path d="M3 16v5h5" />
      <Path d="m3 21 6-6" />
      <Path d="M3 8V3h5" />
      <Path d="M9 9 3 3" />
    </Icon>
  )
}

/** ‹ de 20px (setas do carrossel e do lightbox). */
export function PreviousIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <Path d="m15 18-6-6 6-6" />
    </Icon>
  )
}

/** › de 20px (setas do carrossel e do lightbox). */
export function NextIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <Path d="m9 18 6-6-6-6" />
    </Icon>
  )
}
