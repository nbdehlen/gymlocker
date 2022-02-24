import { RouteProp } from '@react-navigation/core'
import React, { FunctionComponent, useRef, useState } from 'react'
import { Keyboard, ScrollView } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Div, Icon } from 'react-native-magnus'
import { WorkoutParamList } from '../../navigation/navigationTypes'
import { ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import theme, { B } from '../../utils/theme'
import WorkoutTime from '../../components/WorkoutTime'
import Collapsible from 'react-native-collapsible'
import SetsTable from '../../components/SetsTable'

type OwnProps = {}

type Props = OwnProps & {
  route: RouteProp<WorkoutParamList, ScreenRoute.WORKOUT_EDIT>
}

// Both exercises and sets:
// OnLongPress -> re-arrange order?
// onSwipeRight - edit
//
export const WorkoutEditScreen: FunctionComponent<Props> = ({ route }) => {
  const { workout } = route.params
  const dateRef = useRef({
    startDate: workout.start,
    endDate: new Date(workout.start.getTime() + 60 * 60 * 1000)
  })
  const [touched, setTouched] = useState(false) // determine if edited
  const [activeExercise, setActiveExercise] = useState<number>(0)
  const changeActiveExercise = (num: number) => setActiveExercise(num)
  const [expanded, setExpanded] = useState<number[]>([])
  const toggleExpand = (i: number) => {
    if (expanded.includes(i)) {
      const newExpanded = [
        ...expanded.slice(0, expanded.indexOf(i)),
        ...expanded.slice(expanded.indexOf(i) + 1, expanded.length)
      ]
      setExpanded(newExpanded)
    } else {
      setExpanded([...expanded, i])
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      containerStyle={{ flex: 1, backgroundColor: theme.primary.color }}
    >
      <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
        <WorkoutTime forwardedRef={dateRef} />
        <B.Spacer h={20} />
        {workout.exercises.map((exercise, i) => (
          <TouchableWithoutFeedback key={exercise.id} onPress={() => toggleExpand(i)}>
            <Div flexDir="row">
              <Div flex={1} flexDir="row">
                <B.LightText fontWeight="bold" fontSize={14}>
                  {exercise.exercise}
                </B.LightText>
                <B.Spacer w={8} />
                <Icon
                  name={expanded.includes(i) ? 'up' : 'down'}
                  fontFamily="AntDesign"
                  fontSize={14}
                  color={theme.light_1}
                  mr={12}
                />
              </Div>
              <Icon name="edit" fontFamily="FontAwesome" fontSize={16} color={theme.primary.onColor} mr={12} />
            </Div>
            <B.Spacer h={16} />
            <Collapsible collapsed={!expanded.includes(i)}>
              <SetsTable sets={exercise.sets} headers={['WEIGHT', 'REPS', '']} />
            </Collapsible>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

export default WorkoutEditScreen
