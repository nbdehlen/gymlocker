import React from 'react'
import { ParamListBase, RouteProp } from '@react-navigation/core'
// import Icons from '../../../assets/index'
// import theme from '../../utils/theme'
import { ScreenRoute, StackRoute, TabRoute } from './NAV_CONSTANTS'
import theme from '../utils/theme'
import { Icon } from 'react-native-magnus'
import { getThemeColor } from 'react-native-magnus/lib/typescript/src/theme/theme.service'

type TabBarIconProps = {
  focused: boolean
  color: string
  size: number
}

const iconSize = 22

export const screenOptions = (route: RouteProp<ParamListBase, string>) => ({
  tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
    if (route.name === ScreenRoute.CHARTS) {
      return (
        <Icon
          name="like2"
          color={focused ? theme.primary.onColor : theme.light_1}
          fontSize={iconSize}
        />
      )
    }
    if (route.name === ScreenRoute.GOALS) {
      return (
        <Icon
          name="like2"
          color={focused ? theme.primary.onColor : theme.light_1}
          fontSize={iconSize}
        />
      )
    }
    if (route.name === ScreenRoute.GYM) {
      return (
        <Icon
          name="like2"
          color={focused ? theme.primary.onColor : theme.light_1}
          fontSize={iconSize}
        />
      )
    }
    if (route.name === ScreenRoute.SETTINGS) {
      return (
        <Icon
          name="like2"
          color={focused ? theme.primary.onColor : theme.light_1}
          fontSize={iconSize}
        />
      )
    }
  },
})

export const tabBarOptions = {
  keyboardHidesTabBar: true,
  showLabel: false,
  style: {
    height: 38,
    backgroundColor: theme.primary.color,
    paddingTop: 0,
    paddingBottom: 0,
    borderTopWidth: 0,
  },
}
