/// <reference types="uniwind/types" />

import { type ReactNode, useEffect } from 'react'
import { View } from 'react-native'
import { useAnchor } from './anchored-overlay'
import { injectHandler } from './overlay-state'

/**
 * Ancoragem controlada (uso interno de Popover, Menu e Tooltip): mede o gatilho sempre que
 * `isOpen` vira `true`, venha a mudança do toque ou da prop `open`.
 */
export function useControlledAnchor(isOpen: boolean) {
  const anchor = useAnchor()
  const { open: measure } = anchor
  useEffect(() => {
    if (isOpen) measure()
  }, [isOpen, measure])
  return anchor
}

/** Gatilho medível: `View` sem colapso em volta do filho, que recebe o handler. */
export function AnchorTrigger({
  anchorRef,
  children,
  event,
  onTrigger,
  extra,
}: {
  anchorRef: ReturnType<typeof useAnchor>['ref']
  children: ReactNode
  event: 'onPress' | 'onLongPress'
  onTrigger: () => void
  extra?: Record<string, unknown>
}) {
  return (
    <View ref={anchorRef} collapsable={false} className="self-start">
      {injectHandler(children, event, onTrigger, extra)}
    </View>
  )
}
