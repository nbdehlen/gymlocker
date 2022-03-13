import React, { FunctionComponent } from 'react'
import { Input, InputProps } from 'react-native-magnus'
import theme from '../utils/theme'

export enum InputEnum {
  SET_INPUT = 'set_input',
}

const styles = {
  [InputEnum.SET_INPUT]: {
    inputStyle: {
      keyboardType: 'number-pad',
      focusBorderColor: theme.primary.onColor,
      textAlign: 'center',
      fontSize: 28,
      borderWidth: 0,
      borderBottomWidth: 1,
      rounded: 'none',
    },
    touchableStyle: {},
    containerStyle: {},
    textStyle: {},
  },
}

type OwnProps = {
  preset?: InputEnum
}

type Props = OwnProps & InputProps

const CustomInput: FunctionComponent<Props> = ({ preset, ...inputProps }) => {
  const { inputStyle = {} } = preset ? styles[preset] : {}

  return (
    <Input py="none" px="none" m="none" bg={theme.background} color={theme.light_1} {...inputStyle} {...inputProps} />
  )
}
export default CustomInput
