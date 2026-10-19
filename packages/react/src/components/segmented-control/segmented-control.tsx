'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type SegmentedControlProps = ComponentProps<typeof RadioGroup.Root> & {
  /** Obrigatório: descreve o que o controle escolhe (ex.: "Modo de exibição"). */
  'aria-label': string
}

/** Escolha única entre 2–5 views do mesmo conteúdo. Para navegar entre seções, use Tabs. */
export function SegmentedControl({ className, ...props }: SegmentedControlProps) {
  return (
    <RadioGroup.Root
      className={cn(
        'iu:inline-flex iu:items-start iu:gap-1 iu:rounded-md iu:bg-[var(--color-bg-tertiary)] iu:p-1',
        className,
      )}
      {...props}
    />
  )
}

export type SegmentedItemProps = ComponentProps<typeof RadioGroup.Item>

export function SegmentedItem({ className, ...props }: SegmentedItemProps) {
  return (
    <RadioGroup.Item
      className={cn(
        'iu:inline-flex iu:cursor-pointer iu:items-center iu:justify-center iu:whitespace-nowrap iu:rounded-md iu:px-4 iu:py-2 iu:text-sm iu:leading-5 iu:text-[var(--color-text-secondary)] iu:outline-none iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)] iu:data-[state=checked]:bg-[var(--color-bg-primary)] iu:data-[state=checked]:font-medium iu:data-[state=checked]:text-[var(--color-text-primary)] iu:disabled:cursor-not-allowed iu:disabled:text-[var(--color-text-disabled)]',
        className,
      )}
      {...props}
    />
  )
}
