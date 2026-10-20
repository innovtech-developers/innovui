/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Pressable,
  Modal as RNModal,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { cn } from '../../utils/cn'
import { Backdrop } from '../_shared/backdrop'
import { injectHandler, useOpenState } from '../_shared/overlay-state'
import { CloseIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'

const drawerVariants = cva('overflow-hidden border-border-default bg-surface-elevated shadow-2xl', {
  variants: {
    side: {
      right: 'border-l',
      left: 'border-r',
      top: 'border-b',
      bottom: 'border-t',
    },
  },
  defaultVariants: { side: 'right' },
})

const containerVariants = cva('flex-1', {
  variants: {
    side: {
      right: 'flex-row justify-end',
      left: 'flex-row justify-start',
      top: 'justify-start',
      bottom: 'justify-end',
    },
  },
  defaultVariants: { side: 'right' },
})

const CloseContext = createContext<(() => void) | null>(null)

type Side = 'right' | 'left' | 'top' | 'bottom'

export type DrawerProps = VariantProps<typeof drawerVariants> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Título do painel; também é o nome acessível dele. */
  title: ReactNode
  /** O corpo do painel. */
  children: ReactNode
  /** Ações do rodapé (primária à direita). Use `DrawerClose` para fechar. Sem ele, não há rodapé. */
  footer?: ReactNode
  /** Elemento que abre o painel (ex.: um `<Button>`); recebe `onPress`. Dispensável no modo controlado. */
  trigger?: ReactNode
  /** Nome acessível do botão de fechar (×). */
  closeLabel?: string
  className?: string
  testID?: string
}

/**
 * Painel colado a uma borda da tela, que desliza ao abrir e fechar. Usa o `Modal` nativo (botão
 * voltar do Android e toque no fundo fecham). Não há foco preso nem `Esc`.
 */
export function Drawer({
  open,
  defaultOpen,
  onOpenChange,
  title,
  children,
  footer,
  trigger,
  closeLabel = 'Fechar',
  side,
  className,
  testID,
}: DrawerProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange })
  const close = () => setOpen(false)
  const iconColor = useToken('--color-text-primary')
  const { width, height } = useWindowDimensions()
  const placement: Side = side ?? 'right'
  const horizontal = placement === 'left' || placement === 'right'

  // O Modal fica montado durante a animação de saída.
  const [mounted, setMounted] = useState(isOpen)
  const progress = useRef(new Animated.Value(isOpen ? 1 : 0)).current

  useEffect(() => {
    if (isOpen) setMounted(true)
    const animation = Animated.timing(progress, {
      toValue: isOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    })
    animation.start(({ finished }) => {
      if (finished && !isOpen) setMounted(false)
    })
    return () => animation.stop()
  }, [isOpen, progress])

  const offset = horizontal ? width : height
  const sign = placement === 'right' || placement === 'bottom' ? 1 : -1
  const translate = progress.interpolate({ inputRange: [0, 1], outputRange: [sign * offset, 0] })

  return (
    <>
      {injectHandler(trigger, 'onPress', () => setOpen(true))}
      <RNModal
        transparent
        statusBarTranslucent
        animationType="none"
        visible={mounted}
        onRequestClose={close}
      >
        <CloseContext.Provider value={close}>
          <View className={containerVariants({ side })} accessibilityViewIsModal>
            <Animated.View
              pointerEvents="box-none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: progress,
              }}
            >
              <Backdrop onPress={close} testID={testID ? `${testID}-backdrop` : undefined} />
            </Animated.View>
            <Animated.View
              style={[
                horizontal ? { width: '85%', maxWidth: 400 } : { width: '100%', maxHeight: '80%' },
                { transform: [horizontal ? { translateX: translate } : { translateY: translate }] },
              ]}
            >
              <View
                testID={testID}
                className={cn(drawerVariants({ side }), horizontal && 'flex-1', className)}
              >
                <View className="flex-row items-center gap-4 border-b border-border-default px-6 py-4">
                  <Text
                    accessibilityRole="header"
                    className="flex-1 text-lg font-semibold leading-6 text-text-primary"
                  >
                    {title}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={closeLabel}
                    hitSlop={8}
                    onPress={close}
                    className="size-8 items-center justify-center rounded-full active:bg-button-secondary-bg-hover"
                  >
                    <CloseIcon color={iconColor} />
                  </Pressable>
                </View>
                <ScrollView className="shrink" contentContainerClassName="gap-4 p-6">
                  {typeof children === 'string' ? (
                    <Text className="text-sm leading-5 text-text-secondary">{children}</Text>
                  ) : (
                    children
                  )}
                </ScrollView>
                {footer && (
                  <View className="flex-row items-center justify-end gap-2 border-t border-border-default px-6 py-4">
                    {footer}
                  </View>
                )}
              </View>
            </Animated.View>
          </View>
        </CloseContext.Provider>
      </RNModal>
    </>
  )
}

/** Fecha o painel ao pressionar. Envolva um `<Button>` do rodapé (injeta `onPress`, como o `asChild`). */
export function DrawerClose({ children }: { children: ReactNode }) {
  const close = useContext(CloseContext)
  return <>{injectHandler(children, 'onPress', () => close?.())}</>
}
