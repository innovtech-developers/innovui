import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

const containerVariants = cva('iu:mx-auto iu:w-full iu:px-4 iu:tablet:px-6', {
  variants: {
    size: {
      sm: 'iu:max-w-[640px]',
      md: 'iu:max-w-[960px]',
      lg: 'iu:max-w-[1200px]',
      xl: 'iu:max-w-[1440px]',
    },
  },
  defaultVariants: { size: 'lg' },
})

export type ContainerProps = ComponentProps<'div'> & VariantProps<typeof containerVariants>

/**
 * Centraliza o conteúdo com largura máxima e margem lateral (16px no mobile, 24px a partir do
 * tablet). `xl` (1440px) é o breakpoint de desktop do DS.
 */
export function Container({ className, size, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />
}
