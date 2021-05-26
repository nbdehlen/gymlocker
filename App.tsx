import 'reflect-metadata'
import { NavigationContainer } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { ThemeProvider } from 'react-native-magnus'
import { DatabaseConnectionProvider } from './src/data/Connection'
import BottomTabNavigation from './src/navigation/BottomTabNavigation'
import TodoList from './src/components/TodoList'

const theme = {}

export const App: FunctionComponent = () => {
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
