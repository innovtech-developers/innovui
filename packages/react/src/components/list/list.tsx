import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type ListProps = ComponentProps<'ul'> & {
  /** Linha entre os itens. */
  divided?: boolean
}

/** Lista vertical de itens com o mesmo formato (contatos, arquivos, configurações). */
export function List({ className, divided = false, ...props }: ListProps) {
  return (
    <ul
      className={cn(
        'iu:m-0 iu:list-none iu:p-0',
        divided && 'iu:divide-y iu:divide-[var(--color-border-default)]',
        className,
      )}
      {...props}
    />
  )
}

export type ListItemProps = Omit<ComponentProps<'li'>, 'title'> & {
  /** Título do item. */
  title: ReactNode
  /** Texto de apoio abaixo do título. */
  description?: ReactNode
  /** Elemento antes do texto (Avatar, ícone). */
  leading?: ReactNode
  /** Elemento no fim da linha (Badge, Menu, botão). */
  trailing?: ReactNode
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
    <li className={cn('iu:flex iu:items-center iu:gap-3 iu:py-3', className)} {...props}>
      {leading}
      <div className="iu:min-w-0 iu:flex-1">
        <div className="iu:text-sm iu:leading-5 iu:font-medium iu:text-[var(--color-text-primary)]">
          {title}
        </div>
        {description && (
          <div className="iu:text-sm iu:leading-5 iu:text-[var(--color-text-secondary)]">
            {description}
          </div>
        )}
        {children}
      </div>
      {trailing}
    </li>
  )
}
