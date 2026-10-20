/// <reference types="uniwind/types" />

import { Children, createContext, type ReactNode, useContext } from 'react'
import { Pressable, type PressableProps, Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'
import { ChevronRightIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'

const ItemContext = createContext({ isLast: false })

export type BreadcrumbProps = ViewProps & {
  className?: string
}

/** Hierarquia de páginas (Início › Seção › Página). Para fluxos sequenciais, use Stepper. */
export function Breadcrumb({
  className,
  children,
  accessibilityLabel = 'Breadcrumb',
  ...props
}: BreadcrumbProps) {
  const items = Children.toArray(children)

  return (
    // RN não tem role "navigation": o nome acessível fica no accessibilityLabel.
    <View
      accessibilityLabel={accessibilityLabel}
      className={cn('flex-row flex-wrap items-center gap-1', className)}
      {...props}
    >
      {items.map((child, index) => (
        <ItemContext.Provider
          // biome-ignore lint/suspicious/noArrayIndexKey: a posição do item é a identidade dele
          key={index}
          value={{ isLast: index === items.length - 1 }}
        >
          {child}
        </ItemContext.Provider>
      ))}
    </View>
  )
}

export type BreadcrumbItemProps = Omit<PressableProps, 'children' | 'style'> & {
  /** Estilo do item inteiro (link + separador). */
  className?: string
  /** Marca a página atual: não é tocável e fica com estado `selected` (RN não tem aria-current). */
  current?: boolean
  children?: ReactNode
}

/**
 * Um item da trilha. O separador (›) aparece depois de todos, menos do último. No lugar de
 * `href`/`asChild` do web, use `onPress` para navegar (ex.: `router.push`).
 */
export function BreadcrumbItem({
  className,
  current = false,
  children,
  accessibilityState,
  ...props
}: BreadcrumbItemProps) {
  const { isLast } = useContext(ItemContext)
  const separatorColor = useToken('--color-text-tertiary')

  return (
    <View className={cn('flex-row items-center gap-2', className)}>
      {current ? (
        <View accessible accessibilityRole="text" accessibilityState={{ selected: true }}>
          {typeof children === 'string' ? (
            <Text className="text-sm font-medium text-text-primary">{children}</Text>
          ) : (
            children
          )}
        </View>
      ) : (
        <Pressable
          accessibilityRole="link"
          accessibilityState={accessibilityState}
          hitSlop={8}
          {...props}
        >
          {typeof children === 'string' ? (
            <Text className="text-sm text-text-secondary">{children}</Text>
          ) : (
            children
          )}
        </Pressable>
      )}
      {isLast ? null : <ChevronRightIcon color={separatorColor} />}
    </View>
  )
}
