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
          name="graph"
          fontFamily="Octicons"
          color={focused ? theme.primary.onColor : '#e9e9e9cc'}
          fontSize={iconSize}
        />
      )
    }
    if (route.name === ScreenRoute.GOALS) {
      return (
        <Icon
          name="trophy-outline"
          fontFamily="Ionicons"
          color={focused ? theme.primary.onColor : '#e9e9e9cc'}
          fontSize={iconSize}
        />
      )
    }
    if (route.name === StackRoute.GYM) {
      return (
        <Icon
          name="calendar"
          fontFamily="FontAwesome"
          color={focused ? theme.primary.onColor : '#e9e9e9cc'}
          fontSize={iconSize - 2}
        />
      )
    }
    if (route.name === ScreenRoute.SETTINGS) {
      return (
        <Icon
          name="ios-settings-outline"
          fontFamily="Ionicons"
          color={focused ? theme.primary.onColor : '#e9e9e9cc'}
          fontSize={iconSize + 2}
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
