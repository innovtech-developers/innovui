'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentProps, useState } from 'react'
import { cn } from '../../utils/cn'

const avatarVariants = cva(
  'iu:inline-flex iu:shrink-0 iu:select-none iu:items-center iu:justify-center iu:overflow-hidden iu:rounded-full iu:bg-[var(--color-bg-tertiary)] iu:font-medium iu:text-[var(--color-text-secondary)]',
  {
    variants: {
      size: {
        sm: 'iu:size-8 iu:text-xs',
        md: 'iu:size-10 iu:text-sm',
        lg: 'iu:size-14 iu:text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type AvatarProps = Omit<ComponentProps<'span'>, 'children'> &
  VariantProps<typeof avatarVariants> & {
    /** URL da imagem. Se faltar ou falhar ao carregar, mostra as iniciais de `name`. */
    src?: string
    /** Nome da pessoa ou entidade: vira as iniciais do fallback e o texto alternativo. */
    name: string
  }

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/** Imagem circular de uma pessoa ou entidade, com iniciais como fallback. */
export function Avatar({ className, size, src, name, ...props }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>()
  const showImage = src && failedSrc !== src

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          // com SSR, a imagem pode falhar antes da hidratação e o onError nunca chega ao React
          ref={(img) => {
            if (img?.complete && img.naturalWidth === 0) setFailedSrc(src)
          }}
          onError={() => setFailedSrc(src)}
          className="iu:size-full iu:object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  )
}
