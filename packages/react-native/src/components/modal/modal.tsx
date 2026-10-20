/// <reference types="uniwind/types" />

import { cva, type VariantProps } from 'class-variance-authority'
import { createContext, type ReactNode, useContext } from 'react'
import { Pressable, Modal as RNModal, ScrollView, Text, View } from 'react-native'
import { cn } from '../../utils/cn'
import { Backdrop } from '../_shared/backdrop'
import { injectHandler, useOpenState } from '../_shared/overlay-state'
import { CloseIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'

const modalVariants = cva(
  'max-h-full w-full overflow-hidden rounded-lg border border-border-default bg-surface-elevated shadow-2xl',
  {
    variants: {
      size: { sm: 'max-w-[480px]', md: 'max-w-[640px]', lg: 'max-w-[800px]' },
    },
    defaultVariants: { size: 'sm' },
  },
)

const CloseContext = createContext<(() => void) | null>(null)

export type ModalProps = VariantProps<typeof modalVariants> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Título do diálogo; também é o nome acessível dele. */
  title: ReactNode
  /** O corpo do diálogo. */
  children: ReactNode
  /** Ações do rodapé (primária à direita). Use `ModalClose` para fechar. Sem ele, não há rodapé. */
  footer?: ReactNode
  /** Elemento que abre o modal (ex.: um `<Button>`); recebe `onPress`. Dispensável no modo controlado. */
  trigger?: ReactNode
  /** Mostra o botão de fechar (×) no cabeçalho. */
  showClose?: boolean
  /** Linha entre o cabeçalho e o corpo. Padrão: `true`. */
  showHeaderDivider?: boolean
  /** Linha entre o corpo e o rodapé (só aparece com `footer`). Padrão: `true`. */
  showFooterDivider?: boolean
  /** Nome acessível do botão de fechar. */
  closeLabel?: string
  className?: string
  testID?: string
}

/**
 * Diálogo que bloqueia o conteúdo de trás, com backdrop. Usa o `Modal` nativo: o botão voltar do
 * Android e o toque no fundo fecham. Não há foco preso nem `Esc`; `accessibilityViewIsModal`
 * mantém o leitor de tela dentro do diálogo.
 */
export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  title,
  children,
  footer,
  trigger,
  showClose = true,
  showHeaderDivider = true,
  showFooterDivider = true,
  closeLabel = 'Fechar',
  size,
  className,
  testID,
}: ModalProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange })
  const close = () => setOpen(false)
  const iconColor = useToken('--color-text-primary')

  return (
    <>
      {injectHandler(trigger, 'onPress', () => setOpen(true))}
      <RNModal
        transparent
        statusBarTranslucent
        animationType="fade"
        visible={isOpen}
        onRequestClose={close}
      >
        <CloseContext.Provider value={close}>
          <View className="flex-1 items-center justify-center p-4" accessibilityViewIsModal>
            <Backdrop onPress={close} testID={testID ? `${testID}-backdrop` : undefined} />
            <View testID={testID} className={cn(modalVariants({ size }), className)}>
              <View
                className={cn(
                  'flex-row items-center gap-4 px-6 py-4',
                  showHeaderDivider && 'border-b border-border-default',
                )}
              >
                <Text
                  accessibilityRole="header"
                  className="flex-1 text-lg font-semibold leading-6 text-text-primary"
                >
                  {title}
                </Text>
                {showClose && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={closeLabel}
                    hitSlop={8}
                    onPress={close}
                    className="size-8 items-center justify-center rounded-full active:bg-button-secondary-bg-hover"
                  >
                    <CloseIcon color={iconColor} />
                  </Pressable>
                )}
              </View>
              <ScrollView className="shrink" contentContainerClassName="gap-4 p-6">
                {typeof children === 'string' ? (
                  <Text className="text-sm leading-5 text-text-secondary">{children}</Text>
                ) : (
                  children
                )}
              </ScrollView>
              {footer && (
                <View
                  className={cn(
                    'flex-row items-center justify-end gap-2 px-6 py-4',
                    showFooterDivider && 'border-t border-border-default',
                  )}
                >
                  {footer}
                </View>
              )}
            </View>
          </View>
        </CloseContext.Provider>
      </RNModal>
    </>
  )
}

/** Fecha o modal ao pressionar. Envolva um `<Button>` do rodapé (injeta `onPress`, como o `asChild`). */
export function ModalClose({ children }: { children: ReactNode }) {
  const close = useContext(CloseContext)
  return <>{injectHandler(children, 'onPress', () => close?.())}</>
}
