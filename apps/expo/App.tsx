import { Button, ToastProvider } from '@innovui/react-native'
import { StatusBar } from 'expo-status-bar'
import { ScrollView, Text, View } from 'react-native'
import { Uniwind, useUniwind } from 'uniwind'
import './global.css'
import { Actions } from './sections/actions'
import { Display } from './sections/display'
import { Forms } from './sections/forms'
import { Overlays } from './sections/overlays'

export default function App() {
  const { theme } = useUniwind()

  return (
    <ToastProvider>
      <View className="flex-1 bg-bg-primary">
        <ScrollView contentContainerClassName="gap-8 px-6 pb-16 pt-20">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-text-primary">InnovUI</Text>
            <Button
              variant="tertiary"
              size="sm"
              onPress={() => Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            </Button>
          </View>
          <Actions />
          <Forms />
          <Display />
          <Overlays />
        </ScrollView>
        <StatusBar style="auto" />
      </View>
    </ToastProvider>
  )
}
