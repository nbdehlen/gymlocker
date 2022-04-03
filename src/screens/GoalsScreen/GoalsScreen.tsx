import React, { FunctionComponent } from 'react'
import { Text } from 'react-native-magnus'
import { SafeAreaView } from 'react-native-safe-area-context'
import theme from '../../utils/theme'

type OwnProps = {}

type Props = OwnProps

export const GoalsScreen: FunctionComponent<Props> = () => {
  return (
    <SafeAreaView
      style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary.color, flex: 1 }}
    >
      <Text fontSize={40} color={theme.primary.onColor}>
        Goals
      </Text>
    </SafeAreaView>
  )
}

export default GoalsScreen
