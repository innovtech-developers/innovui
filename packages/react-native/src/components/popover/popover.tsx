/// <reference types="uniwind/types" />

import { createContext, type ReactNode, useContext } from 'react'
import { View } from 'react-native'
import { cn } from '../../utils/cn'
import { AnchoredOverlay } from '../_shared/anchored-overlay'
import { AnchorTrigger, useControlledAnchor } from '../_shared/overlay-anchor'
import { injectHandler, useOpenState } from '../_shared/overlay-state'

const CloseContext = createContext<(() => void) | null>(null)

export type PopoverProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Lado do gatilho em que o painel abre; inverte se não couber. Padrão: `bottom`. */
  side?: 'top' | 'bottom'
  /** Elemento que abre o popover (ex.: um `<Button>`); recebe `onPress`. */
  trigger: ReactNode
  /** Nome acessível do painel: descreve o que há nele, ex.: "Filtros". */
  label: string
  /** O conteúdo do popover. Pode ter elementos interativos. */
  children: ReactNode
  className?: string
  testID?: string
}

/**
 * Painel flutuante ancorado ao gatilho, aberto por toque. O conteúdo pode ser interativo; tocar
 * fora ou o botão voltar do Android fecha. Diferenças do web: sem `align` (o painel alinha à
 * esquerda do gatilho), sem lados `left`/`right` e sem devolução de foco.
 */
export function Popover({
  open,
  defaultOpen,
  onOpenChange,
  side = 'bottom',
  trigger,
  label,
  children,
  className,
  testID,
}: PopoverProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange })
  const { ref, rect } = useControlledAnchor(isOpen)
  const close = () => setOpen(false)

  return (
    <>
      <AnchorTrigger anchorRef={ref} event="onPress" onTrigger={() => setOpen(!isOpen)}>
        {trigger}
      </AnchorTrigger>
      <AnchoredOverlay
        visible={isOpen}
        rect={rect}
        onRequestClose={close}
        placement={side}
        offset={8}
        testID={testID}
        className={cn(
          'max-w-xs rounded-[8px] border border-border-default bg-surface-elevated p-4 shadow-md',
          className,
        )}
      >
        <CloseContext.Provider value={close}>
          <View accessibilityLabel={label} accessibilityViewIsModal>
            {children}
          </View>
        </CloseContext.Provider>
      </AnchoredOverlay>
    </>
  )
}

/** Fecha o popover ao pressionar. Envolva um `<Button>` dentro do conteúdo (injeta `onPress`). */
export function PopoverClose({ children }: { children: ReactNode }) {
  const close = useContext(CloseContext)
  return <>{injectHandler(children, 'onPress', () => close?.())}</>
}
