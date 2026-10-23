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
import {
  Animated,
  LayoutAnimation,
  PanResponder,
  Platform,
  Pressable,
  StatusBar,
  Text,
  UIManager,
  View,
} from 'react-native'
import { useReducedMotion } from '../_shared/sliding-indicator'
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

// No Android antigo o LayoutAnimation precisa ser habilitado. Na New Architecture a chamada é no-op.
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

/** Arrastar o toast para o lado além disto (px), ou mais rápido que isto (px/ms), o dispensa. */
const SWIPE_DISTANCE = 50
const SWIPE_VELOCITY = 0.5

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
  const reduced = useReducedMotion()
  const remove = useCallback(
    (id: number) => {
      // os de baixo deslizam para o lugar em vez de pular
      if (!reduced) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setItems((current) => current.filter((item) => item.id !== id))
    },
    [reduced],
  )
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
  // arrastar para o lado dispensa (como o swipe do Radix no web); o auto-fechar pausa enquanto isso
  const dragX = useRef(new Animated.Value(0)).current
  const [dragging, setDragging] = useState(false)
  const latest = useRef({ id, onDismiss })
  latest.current = { id, onDismiss }
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => setDragging(true),
      onPanResponderMove: (_, g) => dragX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        setDragging(false)
        if (Math.abs(g.dx) > SWIPE_DISTANCE || Math.abs(g.vx) > SWIPE_VELOCITY) {
          // continua para o lado de onde o dedo ia, enquanto o toast some
          Animated.timing(dragX, {
            toValue: (g.dx || g.vx) > 0 ? 400 : -400,
            duration: 150,
            useNativeDriver: true,
          }).start()
          latest.current.onDismiss(latest.current.id)
        } else {
          Animated.timing(dragX, { toValue: 0, duration: 200, useNativeDriver: true }).start()
        }
      },
      onPanResponderTerminate: () => {
        setDragging(false)
        Animated.timing(dragX, { toValue: 0, duration: 200, useNativeDriver: true }).start()
      },
    }),
  ).current
  const swipeFade = dragX.interpolate({
    inputRange: [-150, 0, 150],
    outputRange: [0.2, 1, 0.2],
    extrapolate: 'clamp',
  })
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
    if (closing || dragging || duration <= 0) return
    const timer = setTimeout(() => onDismiss(id), duration)
    return () => clearTimeout(timer)
  }, [closing, dragging, duration, id, onDismiss])

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] })

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        opacity: Animated.multiply(progress, swipeFade),
        transform: [{ translateY }, { translateX: dragX }],
      }}
    >
      <View
        accessibilityRole={statusRole(status)}
        // Erro e aviso interrompem o leitor de tela; o resto é anunciado com calma.
        accessibilityLiveRegion={statusRole(status) ? 'assertive' : 'polite'}
        className="flex-row items-start gap-3 rounded-[8px] border border-border-default bg-surface-elevated py-3 pr-3 pl-4 shadow-md"
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
