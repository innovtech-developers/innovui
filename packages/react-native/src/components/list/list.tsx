/// <reference types="uniwind/types" />

import { Children, Fragment, type ReactNode } from 'react'
import { Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'
import { Divider } from '../divider/divider'

export type ListProps = ViewProps & {
  className?: string
  /** Linha entre os itens. */
  divided?: boolean
}

/** Lista vertical de itens com o mesmo formato (contatos, arquivos, configurações). */
export function List({ className, divided = false, children, ...props }: ListProps) {
  // sem `divide-y` no native: intercala um Divider entre os filhos
  const items = Children.toArray(children)

  return (
    <View accessibilityRole="list" className={cn(className)} {...props}>
      {divided
        ? items.map((child, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lista estática de filhos já com key própria
            <Fragment key={i}>
              {i > 0 && <Divider />}
              {child}
            </Fragment>
          ))
        : children}
    </View>
  )
}

export type ListItemProps = Omit<ViewProps, 'children'> & {
  className?: string
  /** Título do item. */
  title: string
  /** Texto de apoio abaixo do título. */
  description?: string
  /** Elemento antes do texto (Avatar, ícone). */
  leading?: ReactNode
  /** Elemento no fim da linha (Badge, Menu, botão). */
  trailing?: ReactNode
  /** Conteúdo extra abaixo da descrição. */
  children?: ReactNode
}

export function ListItem({
  className,
  title,
  description,
  leading,
  trailing,
  children,
  ...props
}: ListItemProps) {
  return (
    <View role="listitem" className={cn('flex-row items-center gap-3 py-3', className)} {...props}>
      {leading}
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-medium leading-5 text-text-primary">{title}</Text>
        {description ? (
          <Text className="text-sm leading-5 text-text-secondary">{description}</Text>
        ) : null}
        {children}
      </View>
      {trailing}
    </View>
  )
}
