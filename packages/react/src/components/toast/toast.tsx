'use client'

import * as RadixToast from '@radix-ui/react-toast'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../../utils/cn'
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
}

type ToastItem = ToastOptions & { id: number }

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

  const dismiss = useCallback(
    (id: number) => setItems((current) => current.filter((item) => item.id !== id)),
    [],
  )
  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++
    setItems((current) => [...current, { ...options, id }])
    return id
  }, [])
  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider duration={5000}>
        {children}
        {items.map(({ id, status = 'info', title, description, action, duration }) => (
          <RadixToast.Root
            key={id}
            // Erro e aviso interrompem o leitor de tela; o resto é anunciado com calma.
            type={status === 'error' || status === 'warning' ? 'foreground' : 'background'}
            duration={duration}
            onOpenChange={(open) => !open && dismiss(id)}
            className={cn(
              'iu:flex iu:items-start iu:gap-3 iu:rounded-md iu:border iu:border-[var(--color-border-default)] iu:bg-[var(--color-surface-elevated)] iu:py-3 iu:pr-3 iu:pl-4 iu:text-sm iu:leading-5 iu:shadow-md',
              statusText[status],
            )}
          >
            <StatusIcon status={status} className="iu:shrink-0" />
            <div className="iu:flex iu:min-w-0 iu:flex-1 iu:flex-col iu:items-start iu:gap-1">
              {title && <RadixToast.Title className="iu:font-medium">{title}</RadixToast.Title>}
              <RadixToast.Description className="iu:text-[var(--color-text-primary)]">
                {description}
              </RadixToast.Description>
              {action && (
                <RadixToast.Action asChild altText={action.label}>
                  <Button variant="ghost" size="sm" onClick={action.onClick}>
                    {action.label}
                  </Button>
                </RadixToast.Action>
              )}
            </div>
            <RadixToast.Close asChild>
              <IconButton aria-label={dismissLabel} variant="ghost" size="sm">
                <CloseIcon />
              </IconButton>
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport
          label={label}
          className="iu:fixed iu:right-4 iu:bottom-4 iu:z-50 iu:m-0 iu:flex iu:w-[360px] iu:max-w-[calc(100vw-2rem)] iu:list-none iu:flex-col iu:gap-2 iu:p-0 iu:outline-none"
        />
      </RadixToast.Provider>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast precisa estar dentro de <ToastProvider>.')
  return context
}
