/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import { useState } from 'react'
import { Image, Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

const avatarVariants = cva(
  'shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-tertiary',
  {
    variants: {
      size: {
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-14',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

const initialsVariants = cva('font-medium text-text-secondary', {
  variants: {
    size: { sm: 'text-xs', md: 'text-sm', lg: 'text-base' },
  },
  defaultVariants: { size: 'md' },
})

export type AvatarProps = Omit<ViewProps, 'children'> &
  VariantProps<typeof avatarVariants> & {
    className?: string
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
    // accessible agrupa o conteúdo num único elemento "img" com o nome como rótulo
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={name}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {showImage ? (
        <Image
          source={{ uri: src }}
          onError={() => setFailedSrc(src)}
          resizeMode="cover"
          className="size-full"
        />
      ) : (
        <Text className={initialsVariants({ size })}>{initials(name)}</Text>
      )}
    </View>
  )
}
