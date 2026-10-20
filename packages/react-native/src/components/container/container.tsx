/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import { useWindowDimensions, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

const TABLET_MIN_WIDTH = 768

const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-[640px]',
      md: 'max-w-[960px]',
      lg: 'max-w-[1200px]',
      xl: 'max-w-[1440px]',
    },
    // sem variante `tablet:` no Uniwind: o breakpoint vem de useWindowDimensions
    tablet: { true: 'px-6', false: 'px-4' },
  },
  defaultVariants: { size: 'lg', tablet: false },
})

export type ContainerProps = ViewProps &
  Pick<VariantProps<typeof containerVariants>, 'size'> & { className?: string }

/**
 * Centraliza o conteúdo com largura máxima e margem lateral (16px no mobile, 24px a partir de
 * 768px de largura de janela).
 */
export function Container({ className, size, ...props }: ContainerProps) {
  const { width } = useWindowDimensions()

  return (
    <View
      className={cn(containerVariants({ size, tablet: width >= TABLET_MIN_WIDTH }), className)}
      {...props}
    />
  )
}
