'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type TabsProps = ComponentProps<typeof RadixTabs.Root>

/** Raiz das abas: controla qual `Tab` está ativa (`value`/`defaultValue`/`onValueChange`). */
export function Tabs(props: TabsProps) {
  return <RadixTabs.Root {...props} />
}

export type TabListProps = ComponentProps<typeof RadixTabs.List>

export function TabList({ className, ...props }: TabListProps) {
  return <RadixTabs.List className={cn('iu:flex iu:items-start', className)} {...props} />
}

export type TabProps = ComponentProps<typeof RadixTabs.Trigger> & {
  /** Ícone à esquerda do rótulo (ex.: um componente do Lucide). Fica em 24px. */
  icon?: ReactNode
}

export function Tab({ className, icon, children, ...props }: TabProps) {
  return (
    <RadixTabs.Trigger
      className={cn(
        'iu:group iu:inline-flex iu:cursor-pointer iu:flex-col iu:items-start iu:gap-[6px] iu:rounded-sm iu:px-3 iu:pt-2 iu:text-sm iu:leading-5 iu:text-[var(--color-text-secondary)] iu:outline-none iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)] iu:not-data-[state=active]:enabled:hover:text-[var(--color-interactive-primary-hover)] iu:data-[state=active]:font-medium iu:data-[state=active]:text-[var(--color-text-brand)] iu:disabled:cursor-not-allowed iu:disabled:text-[var(--color-text-disabled)]',
        className,
      )}
      {...props}
    >
      <span className="iu:inline-flex iu:items-center iu:gap-1 iu:[&_svg]:size-6 iu:[&_svg]:shrink-0">
        {icon}
        {children}
      </span>
      <span
        aria-hidden="true"
        className="iu:h-0.5 iu:w-full iu:bg-transparent iu:group-data-[state=active]:bg-[var(--color-interactive-primary)]"
      />
    </RadixTabs.Trigger>
  )
}

export type TabPanelProps = ComponentProps<typeof RadixTabs.Content>

export function TabPanel({ className, ...props }: TabPanelProps) {
  return (
    <RadixTabs.Content
      className={cn(
        'iu:rounded-sm iu:outline-none iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)]',
        className,
      )}
      {...props}
    />
  )
}
