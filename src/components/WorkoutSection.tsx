import format from 'date-fns/format'
import React, { FunctionComponent, useCallback } from 'react'
import { TouchableOpacity } from 'react-native'
import { WorkoutModel } from '../data/entities/WorkoutModel'
import theme, { B } from '../utils/theme'
import { Div, Icon, Text } from 'react-native-magnus'
import { differenceInMinutes } from 'date-fns'
import { useNavigation } from '@react-navigation/core'
import { ScreenRoute } from '../navigation/NAV_CONSTANTS'

// TODO: Cardio and sets/exercises can't be ordered by time.
// This would be for details/edit page I guess
// Should make a query for all this and add date on exercises and cardio

type WorkoutSummary = {
  data: string | number
  title: string
}

const RenderItem: FunctionComponent<WorkoutSummary> = ({ data, title }) => (
  <Div flex={1} alignItems="center">
    <Text color={theme.light_1} fontSize={14}>
      {data}
    </Text>
    <Text color={theme.light_1} fontSize={12}>
      {title}
    </Text>
  </Div>
)

type OwnProps = {
  workout: WorkoutModel
  onPress?(workout: WorkoutModel): void
}

type Props = OwnProps

const WorkoutSection: FunctionComponent<Props> = ({ workout, onPress }) => {
  const navigation = useNavigation()

  const getTotalSets = useCallback(
    (workout: WorkoutModel) => {
      const exercises =
        workout?.exercises &&
        workout.exercises.map((exercise) => exercise.sets).reduce((acc, cur) => acc.concat(cur), [])
      // console.log(workout?.exercises[0])

      // console.log(exercises, 'FDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD')
      const data = exercises ? exercises?.length : '-'
      const title = 'sets'
      // return { data, title }
      return <RenderItem data={data} title={title} />
    },
    [workout.exercises]
  )

  const getTotalCalories = useCallback(
    (workout: WorkoutModel) => {
      const data =
        workout?.cardios &&
        workout.cardios.map((cardio) => cardio.calories).reduce((acc, cur) => acc + cur)
      const title = 'cal'
      // return { data: data || '-', title }
      return <RenderItem data={data || '-'} title={title} />
    },
    [workout.cardios]
  )

  const getTotalDistance = useCallback(
    (workout: WorkoutModel) => {
      const data =
        workout?.cardios &&
        workout.cardios.map((cardio) => cardio.distance_m).reduce((acc, cur) => acc + cur) / 1000
      const title = 'km'
      // return { data: data || '- ', title }
      return <RenderItem data={data || '-'} title={title} />
    },
    [workout.cardios]
  )

  const getTotalWorkoutDuration = useCallback(
    (workout: WorkoutModel) => {
      const data = differenceInMinutes(workout.end, workout.start)
      const title = 'min'
      // return { data, title }
      return <RenderItem data={data} title={title} />
    },
    [workout.start, workout.end]
  )

  const workoutHandler = [getTotalSets, getTotalCalories, getTotalDistance, getTotalWorkoutDuration]

  return (
    <Div key={workout.id} bg={theme.primary.color} justifyContent="center">
      <TouchableOpacity onPress={() => (onPress ? onPress(workout) : null)}>
        <Div
          flexDir="row"
          flex={1}
          justifyContent="center"
          alignSelf="center"
          borderBottomWidth={1}
          borderColor="rgba(255,255,255,0.4)"
          w="90%"
          pb={4}>
          {workoutHandler.map((fn) => fn(workout))}
          {/* <Div alignItems="flex-end" justifyContent="center">
          <TouchableOpacity onPress={() => onPressEditWorkout(workout)}>
            <Icon
              fontFamily="SimpleLineIcons"
              name="arrow-right"
              color={theme.primary.onColor}
              fontSize={16}
            />
          </TouchableOpacity>
        </Div> */}
        </Div>
        <B.Spacer h={16} />
      </TouchableOpacity>
    </Div>
  )
}

export default WorkoutSection
