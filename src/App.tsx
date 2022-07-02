import 'reflect-metadata'
import 'react-native-gesture-handler'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { ThemeProvider } from 'react-native-magnus'
import { DatabaseConnectionProvider } from './data/Connection'
import BottomTabNavigation from './navigation/BottomTabNavigation'
import { getData, storeData } from './utils/asyncStorage'
import { NEW_INSTALL } from './storageConstants'
import { registerRootComponent } from 'expo'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import theme from './utils/theme'
import { Platform, UIManager } from 'react-native'

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

const magnusTheme = {}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // avoid flashing white background color during screen transitions
    background: theme.background,
  },
}

export const App: FunctionComponent = () => {
  useEffect(() => {
    const checkInstall = async () => {
      const res = await getData(NEW_INSTALL)
      if (!res) {
        storeData(NEW_INSTALL, String(Date.now()))
      }
    }
    checkInstall()
  }, [])

  return (
    <ThemeProvider theme={magnusTheme}>
      <DatabaseConnectionProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="light" backgroundColor={theme.primary.color} />
            <NavigationContainer theme={navTheme}>
              <BottomTabNavigation />
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </DatabaseConnectionProvider>
    </ThemeProvider>
  )
}

export default registerRootComponent(App)
