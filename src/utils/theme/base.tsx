import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { Text, TextProps } from 'react-native-magnus'
import theme from '.'

type Spacings = {
  h?: number
  w?: number
}

export const Spacer: FunctionComponent<Spacings> = ({ h, w }) => (
  <View style={{ height: h, width: w }} />
)

type LightTextProps = {
  children?: any
}

export const LightText: FunctionComponent<LightTextProps & TextProps> = ({
  children,
  ...textProps
}) => (
  <Text color={theme.light_1} {...textProps}>
    {children}
  </Text>
)
