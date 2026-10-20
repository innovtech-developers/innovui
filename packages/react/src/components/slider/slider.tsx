'use client'

import * as RadixSlider from '@radix-ui/react-slider'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type SliderProps = Omit<
  ComponentProps<typeof RadixSlider.Root>,
  'orientation' | 'dir' | 'inverted' | 'children'
> & {
  /** Nome acessível de cada alça, na ordem. Padrão: `aria-label` (com o número, se houver várias). */
  thumbLabels?: string[]
}

/**
 * Escolhe um número (ou um intervalo, com dois valores) arrastando a alça ou usando as setas.
 * `value`/`defaultValue` são arrays: `[40]` para um valor, `[20, 80]` para um intervalo.
 */
export function Slider({ className, thumbLabels, 'aria-label': ariaLabel, ...props }: SliderProps) {
  const count = (props.value ?? props.defaultValue ?? [props.min ?? 0]).length
  const labels = Array.from(
    { length: count },
    (_, i) => thumbLabels?.[i] ?? (count > 1 && ariaLabel ? `${ariaLabel} ${i + 1}` : ariaLabel),
  )

  return (
    <RadixSlider.Root
      className={cn(
        'iu:relative iu:flex iu:h-5 iu:w-full iu:touch-none iu:items-center iu:select-none iu:data-[disabled]:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <RadixSlider.Track className="iu:relative iu:h-1.5 iu:grow iu:rounded-full iu:bg-[var(--color-border-default)]">
        <RadixSlider.Range className="iu:absolute iu:h-full iu:rounded-full iu:bg-[var(--color-interactive-primary)] iu:data-[disabled]:bg-[var(--color-interactive-disabled)]" />
      </RadixSlider.Track>
      {labels.map((label, i) => (
        <RadixSlider.Thumb
          // biome-ignore lint/suspicious/noArrayIndexKey: as alças são posicionais e a ordem nunca muda
          key={i}
          aria-label={label}
          className="iu:block iu:size-5 iu:cursor-grab iu:rounded-full iu:border-2 iu:border-[var(--color-interactive-primary)] iu:bg-[var(--color-bg-primary)] iu:shadow-sm iu:outline-none iu:transition-colors iu:hover:bg-[var(--color-button-secondary-bg)] iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)] iu:focus-visible:ring-offset-2 iu:active:cursor-grabbing iu:data-[disabled]:cursor-not-allowed iu:data-[disabled]:border-[var(--color-interactive-disabled)] iu:data-[disabled]:hover:bg-[var(--color-bg-primary)]"
        />
      ))}
    </RadixSlider.Root>
  )
}
