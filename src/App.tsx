import 'reflect-metadata'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { ThemeProvider } from 'react-native-magnus'
import { DatabaseConnectionProvider } from './data/Connection'
import BottomTabNavigation from './navigation/BottomTabNavigation'
import { getData, storeData } from './utils/asyncStorage'
import { NEW_INSTALL } from './storageConstants'
import { registerRootComponent } from 'expo'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const theme = {}

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
    <ThemeProvider theme={theme}>
      <DatabaseConnectionProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <BottomTabNavigation />
          </NavigationContainer>
        </GestureHandlerRootView>
      </DatabaseConnectionProvider>
    </ThemeProvider>
  )
}

export default registerRootComponent(App)
