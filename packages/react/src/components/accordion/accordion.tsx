'use client'

import * as RadixAccordion from '@radix-ui/react-accordion'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { ChevronRightIcon } from '../_shared/status'

export type AccordionProps = ComponentProps<typeof RadixAccordion.Root>

/**
 * Lista de seções que expandem e recolhem. `type="single"` abre uma por vez (com `collapsible`,
 * dá para fechar todas); `type="multiple"` permite várias abertas.
 */
export function Accordion({ className, ...props }: AccordionProps) {
  return <RadixAccordion.Root className={cn('iu:w-full', className)} {...props} />
}

export type AccordionItemProps = Omit<ComponentProps<typeof RadixAccordion.Item>, 'title'> & {
  /** Texto do cabeçalho: é o botão que expande a seção. */
  title: ReactNode
}

export function AccordionItem({ className, title, children, ...props }: AccordionItemProps) {
  return (
    <RadixAccordion.Item
      className={cn('iu:border-b iu:border-[var(--color-border-default)]', className)}
      {...props}
    >
      <RadixAccordion.Header className="iu:flex">
        <RadixAccordion.Trigger className="iu:group iu:flex iu:flex-1 iu:cursor-pointer iu:items-center iu:justify-between iu:gap-4 iu:rounded-sm iu:py-4 iu:text-left iu:text-sm iu:leading-5 iu:font-medium iu:text-[var(--color-text-primary)] iu:outline-none iu:hover:text-[var(--color-interactive-primary-hover)] iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)] iu:disabled:cursor-not-allowed iu:disabled:text-[var(--color-text-disabled)]">
          {title}
          <ChevronRightIcon className="iu:shrink-0 iu:text-[var(--color-text-secondary)] iu:transition-transform iu:group-data-[state=open]:rotate-90 iu:motion-reduce:transition-none" />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
      <RadixAccordion.Content className="iu:pb-4 iu:text-sm iu:leading-5 iu:text-[var(--color-text-secondary)]">
        {children}
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  )
}
