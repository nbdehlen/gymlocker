import React, { FunctionComponent } from 'react'
import { Div, Text } from 'react-native-magnus'
import theme from '../../utils/theme'

type OwnProps = {}

type Props = OwnProps

export const GymAddEditScreen: FunctionComponent<Props> = () => {
  return (
    <Div flex={1} bg={theme.primary.color}>
      <Text>GymAddEditScreen</Text>
    </Div>
  )
}

export default GymAddEditScreen
