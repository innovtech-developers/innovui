'use client'

import * as RadixToast from '@radix-ui/react-toast'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'
import { toastStyles } from '../_shared/motion'
import { CloseIcon, type Status, StatusIcon, statusText } from '../_shared/status'
import { Button } from '../button'
import { IconButton } from '../icon-button'

export type ToastOptions = {
  status?: Status
  /** Resumo (opcional). */
  title?: ReactNode
  description: ReactNode
  /** Ação contextual (ex.: "Desfazer"). Clicar nela também fecha o toast. */
  action?: { label: string; onClick: () => void }
  /** Tempo até fechar sozinho, em ms. Padrão: 5000. */
  duration?: number
  /** Mostra o ícone do status. Padrão: `true`. */
  showIcon?: boolean
  /** Mostra o botão de fechar (×). Sem ele, o toast ainda fecha pelo `duration`. Padrão: `true`. */
  dismissible?: boolean
}

type ToastItem = ToastOptions & { id: number; open: boolean }

/** Item fechado fica montado até a animação de saída acabar; sem animação (jsdom, movimento reduzido), sai já. */
function useRemoveAfterExit(open: boolean, remove: () => void) {
  const ref = useRef<HTMLLIElement>(null)
  useEffect(() => {
    if (open) return
    const animations = ref.current?.getAnimations?.() ?? []
    Promise.allSettled(animations.map((a) => a.finished)).then(remove)
  })
  return ref
}

function ToastView({
  item,
  remove,
  onClose,
  dismissLabel,
}: {
  item: ToastItem
  remove: () => void
  onClose: () => void
  dismissLabel: string
}) {
  const {
    status = 'info',
    title,
    description,
    action,
    duration,
    open,
    showIcon = true,
    dismissible = true,
  } = item
  const ref = useRemoveAfterExit(open, remove)
  return (
    <RadixToast.Root
      ref={ref}
      open={open}
      // Erro e aviso interrompem o leitor de tela; o resto é anunciado com calma.
      type={status === 'error' || status === 'warning' ? 'foreground' : 'background'}
      duration={duration}
      onOpenChange={(next) => !next && onClose()}
      className={cn(
        toastStyles,
        'iu:flex iu:items-start iu:gap-3 iu:rounded-md iu:border iu:border-[var(--color-border-default)] iu:bg-[var(--color-surface-elevated)] iu:py-3 iu:pr-3 iu:pl-4 iu:text-sm iu:leading-5 iu:shadow-md',
        'iu:data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] iu:data-[swipe=cancel]:translate-x-0 iu:data-[swipe=cancel]:transition-transform',
        statusText[status],
      )}
    >
      {showIcon && <StatusIcon status={status} className="iu:shrink-0" />}
      <div className="iu:flex iu:min-w-0 iu:flex-1 iu:flex-col iu:items-start iu:gap-1">
        {title && <RadixToast.Title className="iu:font-medium">{title}</RadixToast.Title>}
        <RadixToast.Description className="iu:text-[var(--color-text-primary)]">
          {description}
        </RadixToast.Description>
        {action && (
          <RadixToast.Action asChild altText={action.label}>
            <Button variant="ghost" onClick={action.onClick}>
              {action.label}
            </Button>
          </RadixToast.Action>
        )}
      </div>
      {dismissible && (
        <RadixToast.Close asChild>
          <IconButton aria-label={dismissLabel} variant="ghost" size="sm">
            <CloseIcon />
          </IconButton>
        </RadixToast.Close>
      )}
    </RadixToast.Root>
  )
}

type ToastContextValue = {
  /** Exibe um toast e devolve o id, para fechá-lo com `dismiss`. */
  toast: (options: ToastOptions) => number
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export type ToastProviderProps = {
  children: ReactNode
  /** Nome acessível da região de notificações; `{hotkey}` vira o atalho (F8). */
  label?: string
  /** Nome acessível do botão de fechar de cada toast. */
  dismissLabel?: string
}

/** Envolva o app uma vez; qualquer componente abaixo dispara toasts com `useToast()`. */
export function ToastProvider({
  children,
  label = 'Notificações ({hotkey})',
  dismissLabel = 'Fechar',
}: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(0)
  // O viewport vai para o <body>, para escapar de stacking contexts e overflow dos ancestrais.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const viewportRef = useRef<HTMLOListElement>(null)

  // Quando um toast sai, os de baixo subiriam de uma vez. FLIP: guarda a posição de cada um e, se
  // mudou depois da renderização, desliza do lugar antigo para o novo. `offsetTop` ignora
  // transforms, então não confunde com as animações em andamento; `composite: 'add'` soma ao
  // `translate` da entrada/saída/swipe em vez de substituí-lo.
  const tops = useRef(new Map<HTMLElement, number>())
  // biome-ignore lint/correctness/useExhaustiveDependencies: roda a cada mudança da lista
  useLayoutEffect(() => {
    const next = new Map<HTMLElement, number>()
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    for (const el of viewportRef.current?.children ?? []) {
      if (!(el instanceof HTMLElement)) continue
      next.set(el, el.offsetTop)
      const before = tops.current.get(el)
      if (before !== undefined && before !== el.offsetTop && !reduce)
        el.animate?.([{ translate: `0 ${before - el.offsetTop}px` }, { translate: '0 0' }], {
          duration: 200,
          easing: 'ease-out',
          composite: 'add',
        })
    }
    tops.current = next
  }, [items])

  const dismiss = useCallback((id: number) => {
    // O Radix pausa os timers no focusin do viewport e só retoma no focusout. Se o toast focado
    // (ex.: o botão da ação clicada) sair do DOM, esse focusout nunca vem e os outros toasts
    // ficariam pausados para sempre; tirar o foco antes de remover dispara a retomada.
    const active = document.activeElement
    if (active instanceof HTMLElement && viewportRef.current?.contains(active)) active.blur()
    setItems((current) => current.map((item) => (item.id === id ? { ...item, open: false } : item)))
  }, [])
  const remove = useCallback(
    (id: number) => setItems((current) => current.filter((item) => item.id !== id)),
    [],
  )
  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++
    setItems((current) => [...current, { ...options, id, open: true }])
    return id
  }, [])
  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider duration={5000}>
        {children}
        {items.map((item) => (
          <ToastView
            key={item.id}
            item={item}
            remove={() => remove(item.id)}
            onClose={() => dismiss(item.id)}
            dismissLabel={dismissLabel}
          />
        ))}
        {mounted &&
          createPortal(
            <RadixToast.Viewport
              ref={viewportRef}
              label={label}
              className="iu:fixed iu:top-4 iu:right-4 iu:z-50 iu:m-0 iu:flex iu:w-[360px] iu:max-w-[calc(100vw-2rem)] iu:list-none iu:flex-col iu:gap-2 iu:p-0 iu:outline-none"
            />,
            document.body,
          )}
      </RadixToast.Provider>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast precisa estar dentro de <ToastProvider>.')
  return context
}
