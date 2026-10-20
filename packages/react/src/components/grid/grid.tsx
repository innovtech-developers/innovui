import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

const gridVariants = cva('iu:grid', {
  variants: {
    // `responsive` é o grid do DS: 4 colunas no mobile, 8 a partir do tablet, 12 no desktop
    columns: {
      responsive: 'iu:grid-cols-4 iu:tablet:grid-cols-8 iu:desktop:grid-cols-12',
      1: 'iu:grid-cols-1',
      2: 'iu:grid-cols-2',
      3: 'iu:grid-cols-3',
      4: 'iu:grid-cols-4',
      6: 'iu:grid-cols-6',
      12: 'iu:grid-cols-12',
    },
    gap: {
      0: 'iu:gap-0',
      1: 'iu:gap-1',
      2: 'iu:gap-2',
      3: 'iu:gap-3',
      4: 'iu:gap-4',
      6: 'iu:gap-6',
      8: 'iu:gap-8',
    },
  },
  defaultVariants: { columns: 'responsive', gap: 4 },
})

export type GridProps = ComponentProps<'div'> & VariantProps<typeof gridVariants>

/**
 * Grid de colunas iguais. Por padrão segue o grid do DS (4 colunas no mobile, 8 no tablet a
 * partir de 768px, 12 no desktop a partir de 1440px); `columns` fixa um número de colunas.
 */
export function Grid({ className, columns, gap, ...props }: GridProps) {
  return <div className={cn(gridVariants({ columns, gap }), className)} {...props} />
}

const spanVariants = cva('', {
  variants: {
    span: {
      1: 'iu:col-span-1',
      2: 'iu:col-span-2',
      3: 'iu:col-span-3',
      4: 'iu:col-span-4',
      6: 'iu:col-span-6',
      8: 'iu:col-span-8',
      12: 'iu:col-span-12',
      full: 'iu:col-span-full',
    },
  },
})

export type GridItemProps = ComponentProps<'div'> & VariantProps<typeof spanVariants>

/** Célula do Grid que ocupa `span` colunas (`full` ocupa a linha toda). */
export function GridItem({ className, span, ...props }: GridItemProps) {
  return <div className={cn(spanVariants({ span }), className)} {...props} />
}
