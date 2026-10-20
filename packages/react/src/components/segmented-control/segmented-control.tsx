'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'
import { useSlidingIndicator } from '../_shared/sliding-indicator'

export type SegmentedControlProps = ComponentProps<typeof RadioGroup.Root> & {
  /** Obrigatório: descreve o que o controle escolhe (ex.: "Modo de exibição"). */
  'aria-label': string
}

/** Escolha única entre 2–5 views do mesmo conteúdo. Para navegar entre seções, use Tabs. */
export function SegmentedControl({ className, children, ...props }: SegmentedControlProps) {
  const { indicatorRef, measured } = useSlidingIndicator('[role=radio][data-state=checked]')
  return (
    <RadioGroup.Root
      data-slide={measured || undefined}
      className={cn(
        'iu:relative iu:inline-flex iu:items-start iu:gap-1 iu:rounded-md iu:bg-[var(--color-bg-tertiary)] iu:p-1',
        className,
      )}
      {...props}
    >
      {/* o fundo do item marcado é do indicador: fica sob ele e desliza para o próximo */}
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="iu:pointer-events-none iu:absolute iu:top-0 iu:left-0 iu:rounded-md iu:bg-[var(--color-surface-primary)] iu:shadow-sm iu:motion-safe:data-[ready]:transition-[translate,width,height] iu:motion-safe:data-[ready]:duration-200 iu:motion-safe:data-[ready]:ease-out"
      />
      {children}
    </RadioGroup.Root>
  )
}

export type SegmentedItemProps = ComponentProps<typeof RadioGroup.Item>

export function SegmentedItem({ className, ...props }: SegmentedItemProps) {
  return (
    <RadioGroup.Item
      className={cn(
        'iu:relative iu:inline-flex iu:cursor-pointer iu:items-center iu:justify-center iu:whitespace-nowrap iu:rounded-md iu:px-4 iu:py-2 iu:text-sm iu:leading-5 iu:text-[var(--color-text-secondary)] iu:transition-colors iu:outline-none iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)] iu:data-[state=unchecked]:enabled:hover:bg-[var(--color-bg-secondary)] iu:data-[state=unchecked]:enabled:hover:text-[var(--color-text-primary)] iu:data-[state=checked]:bg-[var(--color-surface-primary)] iu:data-[state=checked]:font-medium iu:data-[state=checked]:text-[var(--color-text-primary)] iu:data-[state=checked]:shadow-sm iu:in-data-[slide]:data-[state=checked]:bg-transparent! iu:in-data-[slide]:data-[state=checked]:shadow-none! iu:disabled:cursor-not-allowed iu:disabled:text-[var(--color-text-disabled)]',
        className,
      )}
      {...props}
    />
  )
}
