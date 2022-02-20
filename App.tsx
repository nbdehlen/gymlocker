import 'reflect-metadata'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { ThemeProvider } from 'react-native-magnus'
import { DatabaseConnectionProvider } from './src/data/Connection'
import BottomTabNavigation from './src/navigation/BottomTabNavigation'
import { getData, storeData } from './src/utils/asyncStorage'
import { NEW_INSTALL } from './src/storageConstants'

const theme = {}

export const App: FunctionComponent = () => {
  useEffect(() => {
    const checkInstall = async () => {
      const res = await getData(NEW_INSTALL)
      if (!res) {
        storeData(NEW_INSTALL, String(Date.now()))
      }
      return res
    }
    checkInstall()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <DatabaseConnectionProvider>
        <NavigationContainer>
          <BottomTabNavigation />
        </NavigationContainer>
      </DatabaseConnectionProvider>
    </ThemeProvider>
  )
}

export default App
