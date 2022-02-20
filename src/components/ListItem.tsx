import React, { FunctionComponent } from 'react'
import { TouchableWithoutFeedback, ViewStyle } from 'react-native'
import { Div, DivProps, IconProps, Text, TextProps } from 'react-native-magnus'
import theme from '../utils/theme'

type ListItemProps = {
  title: string
  onPress: () => void
  ListIcon?: FunctionComponent<IconProps>
  iconProps?: IconProps
  iconSuffix?: boolean
  touchableProps?: ViewStyle
  containerProps?: DivProps
  textProps?: TextProps
}

const ListItem: FunctionComponent<ListItemProps> = ({
  title,
  onPress,
  ListIcon,
  iconProps,
  iconSuffix,
  touchableProps,
  containerProps,
  textProps
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress} {...touchableProps}>
      <Div
        flexDir="row"
        borderBottomWidth={1}
        borderBottomColor={theme.light_border}
        pt={16}
        pb={1}
        {...containerProps}
      >
        {!!ListIcon && !iconSuffix && <ListIcon {...iconProps} />}
        <Text color={theme.light_1} fontSize={16} ml={2} {...textProps}>
          {title}
        </Text>
        {!!ListIcon && iconSuffix && <ListIcon {...iconProps} />}
      </Div>
    </TouchableWithoutFeedback>
  )
}

export default ListItem
