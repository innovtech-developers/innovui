import type { ComponentProps } from 'react'

// Ícones do Lucide (viewBox 24); com traço 2.4 saem com 2px aos 20px, como no Figma.
const props = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const playPath =
  'M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z'
const speakerPath =
  'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z'

/** Triângulo de reproduzir; `filled` preenche com a cor atual (botão central do vídeo). */
export function PlayIcon({ filled, ...rest }: { filled?: boolean } & ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" {...props} fill={filled ? 'currentColor' : 'none'} {...rest}>
      <path d={playPath} />
    </svg>
  )
}

export function PauseIcon(rest: ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" {...props} {...rest}>
      <rect x="14" y="3" width="5" height="18" rx="1" />
      <rect x="5" y="3" width="5" height="18" rx="1" />
    </svg>
  )
}

export function VolumeIcon(rest: ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" {...props} {...rest}>
      <path d={speakerPath} />
      <path d="M16 9a5 5 0 0 1 0 6" />
      <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
    </svg>
  )
}

export function VolumeMutedIcon(rest: ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" {...props} {...rest}>
      <path d={speakerPath} />
      <path d="M22 9l-6 6" />
      <path d="M16 9l6 6" />
    </svg>
  )
}

export function MaximizeIcon(rest: ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" {...props} {...rest}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}

export function MinimizeIcon(rest: ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" {...props} {...rest}>
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

/** Quatro setas para fora: o ícone de ampliar que aparece sobre a miniatura. */
export function ExpandIcon(rest: ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" {...props} {...rest}>
      <path d="m15 15 6 6" />
      <path d="m15 9 6-6" />
      <path d="M21 16v5h-5" />
      <path d="M21 8V3h-5" />
      <path d="M3 16v5h5" />
      <path d="m3 21 6-6" />
      <path d="M3 8V3h5" />
      <path d="M9 9 3 3" />
    </svg>
  )
}

/** ‹ de 20px (setas do carrossel e do lightbox). */
export function PreviousIcon(rest: ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" {...props} {...rest}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

/** › de 20px (setas do carrossel e do lightbox). */
export function NextIcon(rest: ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" {...props} {...rest}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
