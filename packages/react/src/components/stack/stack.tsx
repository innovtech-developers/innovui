import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

// gap segue a escala de espaçamento do DS (base 4): 1=4px … 8=32px
const stackVariants = cva('iu:flex', {
  variants: {
    direction: { column: 'iu:flex-col', row: 'iu:flex-row' },
    gap: {
      0: 'iu:gap-0',
      1: 'iu:gap-1',
      2: 'iu:gap-2',
      3: 'iu:gap-3',
      4: 'iu:gap-4',
      6: 'iu:gap-6',
      8: 'iu:gap-8',
    },
    align: {
      start: 'iu:items-start',
      center: 'iu:items-center',
      end: 'iu:items-end',
      stretch: 'iu:items-stretch',
    },
    justify: {
      start: 'iu:justify-start',
      center: 'iu:justify-center',
      end: 'iu:justify-end',
      between: 'iu:justify-between',
    },
    wrap: { true: 'iu:flex-wrap', false: '' },
  },
  defaultVariants: { direction: 'column', gap: 4, wrap: false },
})

export type StackProps = ComponentProps<'div'> & VariantProps<typeof stackVariants>

/** Empilha filhos numa direção com espaçamento uniforme (flexbox + a escala de gap do DS). */
export function Stack({ className, direction, gap, align, justify, wrap, ...props }: StackProps) {
  return (
    <div
      className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
      {...props}
    />
  )
}
