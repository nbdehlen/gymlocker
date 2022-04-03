import React, { FunctionComponent } from 'react'
import { Text } from 'react-native-magnus'
import { SafeAreaView } from 'react-native-safe-area-context'
import theme from '../../utils/theme'

type OwnProps = {}

type Props = OwnProps

export const ChartsScreen: FunctionComponent<Props> = () => (
  <SafeAreaView
    style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary.color, flex: 1 }}
  >
    <Text fontSize={40} color={theme.primary.onColor}>
      Charts
    </Text>
  </SafeAreaView>
)

export default ChartsScreen
