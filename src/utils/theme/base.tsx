import React, { FunctionComponent } from 'react'
import { View } from 'react-native'

type Spacings = {
  h?: number
  w?: number
}

export const Spacer: FunctionComponent<Spacings> = ({ h, w }) => (
  <View style={{ height: h, width: w }} />
)
