'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { buttonBase, buttonVariantStyles } from '../button/button'
import { Spinner } from '../spinner/spinner'

// Quadrado 1:1 nas mesmas alturas do Button (56/44/36); o ícone filho acompanha o tamanho (24/20/16).
const iconButtonVariants = cva(`${buttonBase} iu:shrink-0 iu:[&_svg]:shrink-0`, {
  variants: {
    variant: buttonVariantStyles,
    size: {
      lg: 'iu:size-14 iu:[&_svg]:size-6',
      md: 'iu:size-11 iu:[&_svg]:size-5',
      sm: 'iu:size-9 iu:[&_svg]:size-4',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export type IconButtonProps = Omit<ComponentProps<'button'>, 'children' | 'aria-label'> &
  VariantProps<typeof iconButtonVariants> & {
    /** Obrigatório: sem texto visível, é o nome acessível do botão. */
    'aria-label': string
    /** O ícone (ex.: um componente do Lucide). O tamanho é definido pelo `size` do botão. */
    children: ReactNode
    /** Estado de carregamento: troca o ícone por um spinner e desabilita o botão. */
    loading?: boolean
  }

export function IconButton({
  className,
  variant,
  size,
  type = 'button',
  loading = false,
  disabled,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? <Spinner size={size ?? 'md'} /> : children}
    </button>
  )
}
