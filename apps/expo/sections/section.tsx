import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="text-sm font-semibold uppercase text-text-secondary">{title}</Text>
      <View className="gap-3">{children}</View>
    </View>
  )
}

export function Body({ children }: { children: string }) {
  return <Text className="text-sm text-text-primary">{children}</Text>
}
