import React, { FunctionComponent } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { DrawerRoute, ScreenRoute } from './NAV_CONSTANTS'
import theme, { B } from '../utils/theme'
import { Div, Icon, Text } from 'react-native-magnus'
import GymCalendarScreen from '../screens/GymCalendarScreen'
import { TouchableOpacity } from 'react-native'
import { CommonActions, RouteProp, useNavigation } from '@react-navigation/native'
import { DrawerActions } from '@react-navigation/core'
import WorkoutAddScreen from '../screens/WorkoutAddScreen'
import WorkoutEditScreen from '../screens/WorkoutEditScreen'
import WorkoutDetailsScreen from '../screens/WorkoutDetailsScreen'
import { WorkoutParamList } from './navigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import DrawerNavigation from './DrawerNavigation'

type GymStackNavigation = StackNavigationProp<WorkoutParamList>
type GymStackRouteProp = RouteProp<WorkoutParamList, any> // TODO: Fix this
type Props = {
  route: GymStackRouteProp
  navigation: GymStackNavigation
}

const Stack = createStackNavigator<WorkoutParamList>()
//TODO: Cardio workout relstions broken?
export const GymStack: FunctionComponent<Props> = ({ route }) => {
  // const onPressDrawerMenu = () => nav.openDrawer()

  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => <Div />,
        headerShown: true,
        // headerTitleStyle: {
        //   alignSelf: 'center',
        //   color: theme.dark_1,
        //   fontSize: 18,
        //   marginBottom: 10,
        //   //   backgroundColor: theme.dark_1,
        // },
        // headerBackground: (props) => {
        //   console.log(props, 'fsdfdsfdssfdfds')
        //   return <Div bg="red" />
        // },
        headerStyle: {
          backgroundColor: theme.primary.color,
          // backgroundColor: 'transparent',
          // height: 0,
          elevation: 0,
        },
        headerLeftContainerStyle: {
          marginBottom: 8,
          marginLeft: 4,
        },
        headerTintColor: theme.primary.onColor,
      }}
    >
      <Stack.Screen name={ScreenRoute.CALENDAR} component={GymCalendarScreen} options={{ headerShown: false }} />

      {/* <Stack.Screen
        name={ScreenRoute.WORKOUT_ADD}
        component={WorkoutAddScreen}
        // options={({ route: { params } }) => {
        //   console.log(params)
        options={() => {
          return {
            // headerTransparent: false,
            // style: {},
            // headerContainerStyle: {},
            // headerTitleContainerStyle: { backgroundColor: theme.dark_1 },
            // containerStyle: {},
            // headerTitleStyle: { alignSelf: 'center', color: theme.light_1 },
            // TODO: fix headerLeft
            // headerLeft: (navigation) => {
            //   return (
            //     <TouchableOpacity
            //       style={{
            //         // backgroundColor: theme.primary.color,
            //         // backgroundColor: theme.primary.color,
            //         position: 'absolute',
            //         top: 0,
            //         width: 50,
            //         height: 50,
            //         justifyContent: 'center',
            //         alignItems: 'center',
            //         borderRadius: 100,
            //         // opacity: 0.1,
            //       }}
            //                         onPress={() => navigation.()}>
            //       <Icon name="like2" color={theme.primary.onColor} fontSize={28} />
            //     </TouchableOpacity>
            //   )
            // },
            headerRight: () => <Div />,
            // headerTitle: () => (
            //   <Div
            //     flexDir="row"
            //     alignItems="center"
            //     justifyContent="center"
            //     mb={10}
            //     flexWrap="wrap">
            //     <Text fontSize={18} fontWeight="bold" color={theme.light_1}>
            //       new workout or add
            //     </Text>
            //   </Div>
            // ),
            headerTitle: () => null,
          }
        }}
      /> */}
      <Stack.Screen
        name={DrawerRoute.GYM_DRAWER}
        component={DrawerNavigation}
        options={({ navigation }) => ({
          headerRight: () => {
            const onPress = () => {
              navigation.dispatch(DrawerActions.toggleDrawer())
            }

            return (
              <TouchableOpacity onPress={onPress}>
                <Div mr={20} pb={8} flexDir="row">
                  <B.Spacer w={8} />
                  <Icon name="menu" fontFamily="Feather" color={theme.primary.onColor} fontSize={28} />
                </Div>
              </TouchableOpacity>
            )
          },
          headerTitle: () => null,
        })}
      />
      <Stack.Screen name={ScreenRoute.WORKOUT_DETAILS} component={WorkoutDetailsScreen} />
    </Stack.Navigator>
  )
}

export default GymStack
