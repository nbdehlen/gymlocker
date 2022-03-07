import React, { FunctionComponent, useState } from 'react'
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
  initialValue: string
  // setValue: React.SetStateAction
  setVal: any
  preset?: InputEnum
  lockedState?: any
}

type Props = OwnProps & InputProps

const CustomInput: FunctionComponent<Props> = ({ initialValue, lockedState, preset, ...inputProps }) => {
  // TODO: How to make sure lock icon corresponds with saving state for set/exercise/workout?
  // IF it's locked it should then be saved for the workout?
  const [val, setVal] = useState(initialValue)
  const { inputStyle = {} } = preset ? styles[preset] : {}

  return (
    <Input
      py="none"
      px="none"
      m="none"
      bg={theme.background}
      color={theme.light_1}
      onChangeText={setVal}
      value={val}
      {...inputStyle}
      {...inputProps}
    />
  )
}
export default CustomInput
