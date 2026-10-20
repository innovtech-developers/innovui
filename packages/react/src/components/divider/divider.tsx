import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type DividerProps = ComponentProps<'hr'> & {
  /** `vertical` precisa de um pai flex (ou altura definida) para ocupar a altura. */
  orientation?: 'horizontal' | 'vertical'
}

/** Linha fina que separa blocos de conteúdo. Usa `border/default`. */
export function Divider({ className, orientation = 'horizontal', ...props }: DividerProps) {
  return (
    <hr
      aria-orientation={orientation}
      className={cn(
        'iu:m-0 iu:shrink-0 iu:border-0 iu:bg-[var(--color-border-default)]',
        orientation === 'horizontal' ? 'iu:h-px iu:w-full' : 'iu:w-px iu:self-stretch',
        className,
      )}
      {...props}
    />
  )
}
