import React, { FunctionComponent } from 'react'
import { createStackNavigator, StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { ScreenRoute, TabRoute } from './NAV_CONSTANTS'
import theme from '../utils/theme'
import { Div, Icon, Text } from 'react-native-magnus'
import GymCalendarScreen from '../screens/GymCalendarScreen'
import GymAddEditScreen from '../screens/GymAddEditScreen'
import { TouchableOpacity } from 'react-native'
import { CommonActions } from '@react-navigation/native'

type OwnProps = {}

type Props = OwnProps

const Stack = createStackNavigator()
//TODO: Cardio workout relstions broken?
export const GymStack: FunctionComponent = ({ navigation }) => {
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
      }}>
      <Stack.Screen
        name={ScreenRoute.CALENDAR}
        component={GymCalendarScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ScreenRoute.ADD_EDIT}
        component={GymAddEditScreen}
        // options={({ route: { params } }) => {
        //   console.log(params)
        options={() => {
          // dfsfdfdsfds
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
            //       // onPress={() => navigation.dispatch(CommonActions.goBack())}>
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
      />
    </Stack.Navigator>
  )
}

export default GymStack
