import { RouteProp } from '@react-navigation/core'
import React, { FunctionComponent, useRef, useState } from 'react'
import { Keyboard, ScrollView } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Button, Div, Icon, Text } from 'react-native-magnus'
import { WorkoutParamList } from '../../navigation/navigationTypes'
import { ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import theme, { B } from '../../utils/theme'
import WorkoutTime from '../../components/WorkoutTime'

type OwnProps = {}

type Props = OwnProps & {
  route: RouteProp<WorkoutParamList, ScreenRoute.WORKOUT_EDIT>
}

// TODO: OnLongPress -> re-arrange order?
export const WorkoutEditScreen: FunctionComponent<Props> = ({ route }) => {
  const { workout } = route.params
  const dateRef = useRef({
    startDate: workout.start,
    endDate: new Date(workout.start.getTime() + 60 * 60 * 1000)
  })
  const [touched, setTouched] = useState(false) // determine if edited
  const [activeExercise, setActiveExercise] = useState<number>(0)
  const changeActiveExercise = (num: number) => setActiveExercise(num)

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      containerStyle={{ flex: 1, backgroundColor: theme.primary.color }}
    >
      <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
        <WorkoutTime forwardedRef={dateRef} />
        <B.Spacer h={20} />
        {workout.exercises.map((exercise, i) => (
          <Div key={i}>
            <Div flexDir="row">
              <Div flex={1}>
                <B.LightText fontWeight="bold" fontSize={14}>
                  {exercise.exercise}
                </B.LightText>
              </Div>
              <Icon name="edit" fontFamily="FontAwesome" fontSize={16} color={theme.primary.onColor} mr={12} />
            </Div>
            <Div flexDir="row" />
            <B.Spacer h={16} />
          </Div>
        ))}
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

export default WorkoutEditScreen
