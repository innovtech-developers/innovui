/// <reference types="uniwind/types" />

import { type ReactElement, type ReactNode, useEffect } from 'react'
import { Text, View } from 'react-native'
import { cn } from '../../utils/cn'
import { AnchoredOverlay } from '../_shared/anchored-overlay'
import { AnchorTrigger, useControlledAnchor } from '../_shared/overlay-anchor'
import { useOpenState } from '../_shared/overlay-state'

export type TooltipProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** O elemento que dispara o tooltip (ex.: um `<Button>`); recebe `onLongPress`. */
  children: ReactElement
  /** O texto principal. */
  content: ReactNode
  /** Título em destaque acima do texto (opcional). */
  title?: ReactNode
  /** Lado do gatilho em que o tooltip aparece; inverte se não couber. Padrão: `top`. */
  side?: 'top' | 'bottom'
  /** Fecha sozinho depois deste tempo, em ms. `0` mantém aberto até tocar fora. Padrão: 3000. */
  duration?: number
  className?: string
  testID?: string
}

/**
 * Dica contextual. No toque não há hover: abre ao pressionar e segurar o gatilho (`onLongPress`),
 * e fecha após `duration` ou ao tocar fora. Como o long press não é óbvio para leitores de tela,
 * o `content` (se for texto) vira o `accessibilityHint` do gatilho. Diferenças do web: sem
 * `delayDuration`, sem seta (`showArrow`) e sem lados `left`/`right`.
 */
export function Tooltip({
  open,
  defaultOpen,
  onOpenChange,
  children,
  content,
  title,
  side = 'top',
  duration = 3000,
  className,
  testID,
}: TooltipProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange })
  const { ref, rect } = useControlledAnchor(isOpen)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!isOpen || duration <= 0) return
    const timer = setTimeout(() => setOpen(false), duration)
    return () => clearTimeout(timer)
  }, [isOpen, duration, setOpen])

  const hint = typeof content === 'string' ? content : undefined

  return (
    <>
      <AnchorTrigger
        anchorRef={ref}
        event="onLongPress"
        onTrigger={() => setOpen(true)}
        extra={hint ? { accessibilityHint: hint } : undefined}
      >
        {children}
      </AnchorTrigger>
      <AnchoredOverlay
        visible={isOpen}
        rect={rect}
        onRequestClose={close}
        placement={side}
        estimatedHeight={80}
        testID={testID}
        className={cn('max-w-[240px] gap-1 rounded-sm bg-bg-inverse px-3 py-2', className)}
      >
        <View accessibilityRole="text">
          {title && (
            <Text className="text-[13px] font-medium leading-4 text-text-inverse">{title}</Text>
          )}
          <Text className="text-xs leading-4 text-text-inverse-secondary">{content}</Text>
        </View>
      </AnchoredOverlay>
    </>
  )
}
