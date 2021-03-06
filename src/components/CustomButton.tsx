import React, { FunctionComponent, ReactNode } from 'react'
import { TouchableOpacityProps } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Div, DivProps, IconProps, Text, TextProps } from 'react-native-magnus'
import theme from '../utils/theme'

/*
NOTE: Using magnus for text for the theme fontSize props
TODO: Create a config for sizing/spacing
xs 	11
sm 	12
md 	13
lg 	15
xl 	17
2xl 	19
3xl 	21
4xl 	24
5xl 	27
6xl 	32
*/

export enum ButtonEnum {
  LIST_ITEM = 'list_item',
  PRIMARY = 'primary',
  CANCEL = 'cancel',
  OPTION = 'option',
  SELECTED = 'selected',
}

const styles = {
  [ButtonEnum.OPTION]: {
    touchableStyle: {},
    containerStyle: {
      borderStyle: 'solid',
      borderColor: theme.light_border,
      justifyContent: 'center',
      flexDir: 'row',
      rounded: 'circle',
      py: 'xs',
      px: 'md',
    },
    textStyle: { color: theme.light_border },
  },
  [ButtonEnum.SELECTED]: {
    touchableStyle: {},
    containerStyle: {
      borderStyle: 'solid',
      borderColor: theme.primary.border,
      justifyContent: 'center',
      flexDir: 'row',
      rounded: 'circle',
      py: 'xs',
      px: 'md',
    },
    textStyle: { color: theme.primary.onColor },
  },
  [ButtonEnum.LIST_ITEM]: {
    touchableStyle: {},
    containerStyle: {
      flexDir: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.light_border,
      pt: 'md',
      pb: 1,
      my: 'md',
    },
    textStyle: {
      pl: 'xs',
    },
  },
  [ButtonEnum.PRIMARY]: {
    touchableStyle: {},
    containerStyle: {
      flexDir: 'row',
      alignSelf: 'center',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: theme.primary.border,
      justifyContent: 'center',
      rounded: 'md',
      py: 'md',
      px: 'lg',
    },
    textStyle: { color: theme.primary.onColor },
  },
  [ButtonEnum.CANCEL]: {
    touchableStyle: {},
    containerStyle: {
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#8b3535',
      justifyContent: 'center',
      flexDir: 'row',
      rounded: 'md',
      py: 'md',
      px: 'lg',
      mb: 'sm',
    },
    textStyle: { color: '#8b3535' },
  },
}

type OwnProps = {
  text?: string
  textProps?: TextProps
  onPress?: () => void
  preset?: ButtonEnum
  IconComponent?: FunctionComponent<IconProps>
  iconSuffix?: boolean
  iconProps?: IconProps
  containerProps?: DivProps
  children?: ReactNode
}

type Props = OwnProps & TouchableOpacityProps

const CustomButton: FunctionComponent<Props> = ({
  text,
  textProps,
  onPress,
  preset,
  IconComponent,
  iconSuffix,
  iconProps = {},
  containerProps,
  children,
  ...touchableProps
}) => {
  const { touchableStyle = {}, containerStyle = {}, textStyle = {} } = preset ? styles[preset] : {}

  return (
    <TouchableOpacity onPress={onPress} style={touchableStyle} {...touchableProps}>
      <Div {...(IconComponent && { flexDir: 'row' })} {...containerStyle} {...containerProps}>
        {!!IconComponent && !iconSuffix && <IconComponent {...iconProps} />}
        {text && (
          <Text color={theme.light_1} fontSize="xl" {...textStyle} {...textProps}>
            {text}
          </Text>
        )}
        {children && children}
        {!!IconComponent && iconSuffix && <IconComponent {...iconProps} />}
      </Div>
    </TouchableOpacity>
  )
}
export default CustomButton
