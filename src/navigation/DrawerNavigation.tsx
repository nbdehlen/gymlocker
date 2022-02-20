import React, { FunctionComponent } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import WorkoutAddScreen from '../screens/WorkoutAddScreen'
import { ScreenRoute } from './NAV_CONSTANTS'
import WorkoutEditScreen from '../screens/WorkoutEditScreen'
import { WorkoutModel } from '../data/entities/WorkoutModel'
import WorkoutDrawer from '../components/WorkoutDrawer'

type OwnProps = {}

type Props = OwnProps

const DrawerNavigation: FunctionComponent<Props> = ({ route, navigation }) => {
  const Drawer = createDrawerNavigator()
  // TODO: params twice when going navigating to nested screen.
  // didn't investigate too deeply on how to fix.
  const workout: WorkoutModel = route?.params?.params?.workout

  return (
    <Drawer.Navigator drawerContent={() => <WorkoutDrawer workout={workout} />} drawerStyle={{ width: '40%' }}>
      <Drawer.Screen name={ScreenRoute.WORKOUT_ADD} component={WorkoutAddScreen} />
      <Drawer.Screen name={ScreenRoute.WORKOUT_EDIT} component={WorkoutEditScreen} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigation
