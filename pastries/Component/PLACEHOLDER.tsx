import React, { FunctionComponent } from 'react'
import { Div, Text } from 'react-native-magnus'

type OwnProps = {}

type Props = OwnProps

export const PLACEHOLDER: FunctionComponent<Props> = () => {
  return (
    <Div>
      <Text>PLACEHOLDER</Text>
    </Div>
  )
}

export default PLACEHOLDER
