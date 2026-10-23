/// <reference types="uniwind/types" />

import type { ReactNode } from 'react'
import { Modal, View } from 'react-native'
import { Backdrop } from '../_shared/backdrop'

/**
 * Painel do calendário (uso interno). Decisão: Modal nativo centralizado com Backdrop em vez de
 * camada ancorada, porque o calendário (280 de largura, mais os atalhos no período) não cabe de
 * forma previsível junto a gatilhos estreitos ou perto da borda da tela.
 */
export function DateSheet({
  visible,
  onRequestClose,
  children,
  testID,
}: {
  visible: boolean
  onRequestClose: () => void
  children: ReactNode
  testID?: string
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center p-4">
        <Backdrop onPress={onRequestClose} testID={testID ? `${testID}-backdrop` : undefined} />
        <View
          testID={testID}
          className="max-w-full rounded-[12px] border border-border-default bg-surface-elevated p-3 shadow-md"
        >
          {children}
        </View>
      </View>
    </Modal>
  )
}
