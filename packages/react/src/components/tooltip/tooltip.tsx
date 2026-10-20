'use client'

import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { popStyles } from '../_shared/motion'

export type TooltipProps = {
  /** O elemento que dispara o tooltip (precisa aceitar `ref` e foco, como um `<button>`). */
  children: ReactNode
  /** O texto principal. */
  content: ReactNode
  /** Título em destaque acima do texto (opcional). */
  title?: ReactNode
  /** Lado do trigger em que o tooltip aparece. */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /** Mostra a seta apontando para o trigger. */
  showArrow?: boolean
  /** Atraso para abrir, em ms. */
  delayDuration?: number
  className?: string
} & Pick<ComponentProps<typeof RadixTooltip.Root>, 'open' | 'defaultOpen' | 'onOpenChange'>

/** Dica contextual que abre no hover ou foco do trigger. Informação complementar, nunca crítica. */
export function Tooltip({
  children,
  content,
  title,
  side = 'top',
  showArrow = true,
  delayDuration = 200,
  className,
  ...props
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root {...props}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            className={cn(
              popStyles,
              'iu:origin-[var(--radix-tooltip-content-transform-origin)] iu:z-50 iu:flex iu:max-w-[240px] iu:flex-col iu:gap-1 iu:rounded-sm iu:bg-[var(--color-bg-inverse)] iu:px-3 iu:py-2 iu:text-xs iu:leading-4',
              className,
            )}
          >
            {title && (
              <span className="iu:text-[13px] iu:font-medium iu:text-[var(--color-text-inverse)]">
                {title}
              </span>
            )}
            <span className="iu:text-[var(--color-text-inverse-secondary)]">{content}</span>
            {showArrow && (
              <RadixTooltip.Arrow
                width={8}
                height={5}
                className="iu:fill-[var(--color-bg-inverse)]"
              />
            )}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
