/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import { View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

// gap segue a escala de espaçamento do DS (base 4): 1=4px … 8=32px
const stackVariants = cva('', {
  variants: {
    direction: { column: 'flex-col', row: 'flex-row' },
    gap: {
      0: 'gap-0',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
    wrap: { true: 'flex-wrap', false: '' },
  },
  defaultVariants: { direction: 'column', gap: 4, wrap: false },
})

export type StackProps = ViewProps & VariantProps<typeof stackVariants> & { className?: string }

/** Empilha filhos numa direção com espaçamento uniforme (flexbox + a escala de gap do DS). */
export function Stack({ className, direction, gap, align, justify, wrap, ...props }: StackProps) {
  return (
    <View
      className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
      {...props}
    />
  )
}
