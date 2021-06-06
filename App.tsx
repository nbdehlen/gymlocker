import 'reflect-metadata'
import { NavigationContainer } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { ThemeProvider } from 'react-native-magnus'
import { DatabaseConnectionProvider } from './src/data/Connection'
import BottomTabNavigation from './src/navigation/BottomTabNavigation'
import { getData } from './src/utils/asyncStorage'
const theme = {}

const STORAGE_KEY = 'new_install'

export const App: FunctionComponent = () => {
  useEffect(() => {
    const isNewInstall = async () => {
      await getData(STORAGE_KEY).then((x) => console.log('isNewInstall', x))
    }
    isNewInstall()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <DatabaseConnectionProvider>
        <NavigationContainer>
          <BottomTabNavigation />
          {/* <TodoList /> */}
        </NavigationContainer>
      </DatabaseConnectionProvider>
    </ThemeProvider>
  )
}

export default App
