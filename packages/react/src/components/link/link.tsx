import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type LinkProps = ComponentProps<'a'> & {
  /** Renderiza o filho como o link (ex.: o `<Link>` do seu roteador), em vez de um `<a>`. */
  asChild?: boolean
}

/**
 * Link de texto na cor da marca, sempre sublinhado (a cor sozinha não distingue o link do texto).
 * Com `asChild`, estiliza o link do seu roteador.
 */
export function Link({ className, asChild = false, ...props }: LinkProps) {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      className={cn(
        'iu:rounded-sm iu:text-[var(--color-text-brand)] iu:underline iu:underline-offset-2 iu:outline-none iu:transition-colors iu:hover:text-[var(--color-interactive-primary-hover)] iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-border-focus)] iu:focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  )
}
