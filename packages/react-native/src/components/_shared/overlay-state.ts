import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useState,
} from 'react'

type OpenState = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/** Estado aberto/fechado controlado (`open`) ou não (`defaultOpen`), como no Radix do web. */
export function useOpenState({ open, defaultOpen = false, onOpenChange }: OpenState) {
  const [inner, setInner] = useState(defaultOpen)
  const isControlled = open !== undefined
  const current = isControlled ? open : inner

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInner(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  return [current, setOpen] as const
}

/**
 * Equivalente do `asChild` do Radix: injeta um handler (`onPress`/`onLongPress`) no elemento
 * filho, preservando o handler que ele já tinha.
 */
export function injectHandler(
  child: ReactNode,
  name: 'onPress' | 'onLongPress',
  handler: () => void,
  extra?: Record<string, unknown>,
): ReactNode {
  if (!isValidElement(child)) return child
  const element = child as ReactElement<Record<string, unknown>>
  const original = element.props[name] as ((...args: unknown[]) => void) | undefined
  return cloneElement(element, {
    ...extra,
    [name]: (...args: unknown[]) => {
      original?.(...args)
      handler()
    },
  })
}
