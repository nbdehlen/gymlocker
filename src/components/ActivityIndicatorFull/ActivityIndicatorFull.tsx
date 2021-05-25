import React, { FunctionComponent } from 'react'
import { ActivityIndicator } from 'react-native'
import { Div } from 'react-native-magnus'
import theme from '../../utils/theme'

type OwnProps = {}

type Props = OwnProps

export const ActivityIndicatorFull: FunctionComponent<Props> = () => {
  return (
    <Div flex={1} justifyContent="center" alignItems="center" bg={theme.background}>
      <ActivityIndicator size="large" color={theme.primary.onColor} />
    </Div>
  )
}

export default ActivityIndicatorFull
