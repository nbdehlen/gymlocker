import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { FunctionComponent } from 'react'
import { ScreenRoute, StackRoute } from './NAV_CONSTANTS'
import { screenOptions, tabBarOptions } from './BottomTabConfig'
import SettingsScreen from '../screens/SettingsScreen'
import GoalsScreen from '../screens/GoalsScreen'
import ChartsScreen from '../screens/ChartsScreen'
import GymStack from './GymStack'

type OwnProps = {}

type Props = OwnProps

export const BottomTabNavigation: FunctionComponent<Props> = ({ }) => {
  const Tab = createBottomTabNavigator()

  return (
    <Tab.Navigator screenOptions={({ route }) => screenOptions(route)} tabBarOptions={tabBarOptions}>
      {/* TODO: Charts, top weights */}
      <Tab.Screen name={ScreenRoute.CHARTS} component={ChartsScreen} />
      {/* TODO: Log, CRUD workout, Add exercise / group of exercise, search */}
      {/* UD -> long press, delete Slide right with undo option? */}
      <Tab.Screen name={StackRoute.GYM} component={GymStack} />
      {/* TODO: Current goals, set goals */}
      <Tab.Screen name={ScreenRoute.GOALS} component={GoalsScreen} />
      {/* TODO: kg/lb, clear db, prefs? */}
      <Tab.Screen name={ScreenRoute.SETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export default BottomTabNavigation
