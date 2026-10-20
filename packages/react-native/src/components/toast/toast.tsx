/// <reference types="uniwind/types" />

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Animated, Platform, Pressable, StatusBar, Text, View } from 'react-native'
import {
  CloseIcon,
  type Status,
  StatusIcon,
  statusRole,
  statusText,
  statusTextToken,
} from '../_shared/status'
import { useToken } from '../_shared/use-token'
import { Button } from '../button/button'

export type ToastOptions = {
  status?: Status
  /** Resumo (opcional). */
  title?: string
  description: string
  /** Ação contextual (ex.: "Desfazer"). Tocar nela também fecha o toast. */
  action?: { label: string; onClick: () => void }
  /** Tempo até fechar sozinho, em ms. `0` não fecha sozinho. Padrão: 5000. */
  duration?: number
  /** Mostra o ícone do status. Padrão: `true`. */
  showIcon?: boolean
  /** Mostra o botão de fechar (×). Sem ele, o toast ainda fecha pelo `duration`. Padrão: `true`. */
  dismissible?: boolean
}

type ToastItem = ToastOptions & { id: number; closing: boolean }

type ToastContextValue = {
  /** Exibe um toast e devolve o id, para fechá-lo com `dismiss`. */
  toast: (options: ToastOptions) => number
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export type ToastProviderProps = {
  children: ReactNode
  /** Nome acessível da região de notificações. */
  label?: string
  /** Nome acessível do botão de fechar de cada toast. */
  dismissLabel?: string
  testID?: string
}

// Sem react-native-safe-area-context: margem fixa para o notch no iOS e a barra de status no Android.
const topInset = Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight ?? 24) + 8

/**
 * Envolva o app uma vez; qualquer componente abaixo dispara toasts com `useToast()`. A pilha fica
 * no topo da tela, acima do conteúdo do app, mas abaixo de Modal/Drawer (que são janelas nativas).
 */
export function ToastProvider({
  children,
  label = 'Notificações',
  dismissLabel = 'Fechar',
  testID,
}: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  // Marca como "closing"; o próprio toast anima a saída e então chama `remove`.
  const dismiss = useCallback((id: number) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, closing: true } : item)),
    )
  }, [])
  const remove = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])
  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++
    setItems((current) => [...current, { ...options, id, closing: false }])
    return id
  }, [])
  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View
        pointerEvents="box-none"
        accessibilityLabel={label}
        testID={testID}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999, elevation: 9999 }}
      >
        <View
          pointerEvents="box-none"
          className="w-full max-w-[360px] gap-2 self-center px-4"
          style={{ paddingTop: topInset }}
        >
          {items.map((item) => (
            <ToastView
              key={item.id}
              item={item}
              dismissLabel={dismissLabel}
              onDismiss={dismiss}
              onRemove={remove}
            />
          ))}
        </View>
      </View>
    </ToastContext.Provider>
  )
}

function ToastView({
  item,
  dismissLabel,
  onDismiss,
  onRemove,
}: {
  item: ToastItem
  dismissLabel: string
  onDismiss: (id: number) => void
  onRemove: (id: number) => void
}) {
  const {
    id,
    status = 'info',
    title,
    description,
    action,
    duration = 5000,
    showIcon = true,
    dismissible = true,
    closing,
  } = item
  const progress = useRef(new Animated.Value(0)).current
  const iconColor = useToken(statusTextToken[status])
  const closeColor = useToken('--color-text-primary')

  useEffect(() => {
    if (closing) return
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    })
    animation.start()
    return () => animation.stop()
  }, [closing, progress])

  useEffect(() => {
    if (!closing) return
    const animation = Animated.timing(progress, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    })
    animation.start(({ finished }) => finished && onRemove(id))
    return () => animation.stop()
  }, [closing, id, onRemove, progress])

  useEffect(() => {
    if (closing || duration <= 0) return
    const timer = setTimeout(() => onDismiss(id), duration)
    return () => clearTimeout(timer)
  }, [closing, duration, id, onDismiss])

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] })

  return (
    <Animated.View style={{ opacity: progress, transform: [{ translateY }] }}>
      <View
        accessibilityRole={statusRole(status)}
        // Erro e aviso interrompem o leitor de tela; o resto é anunciado com calma.
        accessibilityLiveRegion={statusRole(status) ? 'assertive' : 'polite'}
        className="flex-row items-start gap-3 rounded-md border border-border-default bg-surface-elevated py-3 pr-3 pl-4 shadow-md"
        style={{ elevation: 6 }}
      >
        {showIcon && <StatusIcon status={status} color={iconColor} />}
        <View className="min-w-0 flex-1 items-start gap-1">
          {title ? (
            <Text className={`text-sm font-medium leading-5 ${statusText[status]}`}>{title}</Text>
          ) : null}
          <Text className="text-sm leading-5 text-text-primary">{description}</Text>
          {action && (
            <Button
              variant="ghost"
              onPress={() => {
                action.onClick()
                onDismiss(id)
              }}
            >
              {action.label}
            </Button>
          )}
        </View>
        {dismissible && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={dismissLabel}
            hitSlop={8}
            onPress={() => onDismiss(id)}
            className="size-8 items-center justify-center rounded-full active:bg-button-secondary-bg-hover"
          >
            <CloseIcon color={closeColor} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast precisa estar dentro de <ToastProvider>.')
  return context
}
