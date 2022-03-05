import React, { FunctionComponent, useCallback } from 'react'
import { TouchableOpacity } from 'react-native'
import { WorkoutModel } from '../data/entities/WorkoutModel'
import theme, { B } from '../utils/theme'
import { Div, Text } from 'react-native-magnus'
import { differenceInMinutes } from 'date-fns'

// TODO: Cardio and sets/exercises can't be ordered by time.
// This would be for details/edit page I guess
// Should make a query for all this and add date on exercises and cardio

type SummaryEntry = { title: string; data: string }

const getTotalSets = (workout: WorkoutModel): SummaryEntry => {
  const sets = workout.exercises
    .map((exercise) => exercise?.sets)
    .filter((val) => val?.length > 0)
    .reduce((acc, cur) => acc + (cur?.length ?? 0), 0)

  const title = 'sets'

  return { data: sets > 0 ? String(sets) : '-', title }
}

const getTotalCalories = (workout: WorkoutModel): SummaryEntry => {
  const calorieCount = workout.cardios?.map((cardio) => cardio?.calories).reduce((acc, cur) => acc + cur, 0)
  const title = 'cal'

  return { data: calorieCount > 0 ? String(calorieCount) : '-', title }
}

const getTotalDistance = (workout: WorkoutModel): SummaryEntry => {
  const distance_km = workout?.cardios.map((cardio) => cardio?.distance_m).reduce((acc, cur) => acc + cur, 0) / 1000
  const title = 'km'

  return { data: distance_km > 0 ? String(distance_km) : '-', title }
}

const getTotalWorkoutDuration = (workout: WorkoutModel): SummaryEntry => {
  const duration = differenceInMinutes(workout.end, workout.start)
  const title = 'min'

  return { data: duration > 0 ? String(duration) : '-', title }
}

type OwnProps = {
  workout: WorkoutModel
  onPress?(workout: WorkoutModel): void
}

type Props = OwnProps

const WorkoutSummary: FunctionComponent<Props> = ({ workout, onPress }) => {
  const workoutHandler = [getTotalSets, getTotalCalories, getTotalDistance, getTotalWorkoutDuration]

  const RenderItem = useCallback(
    ({ data, title }: SummaryEntry) => (
      <Div flex={1} alignItems="center">
        <Text color={theme.light_1} fontSize={14}>
          {data}
        </Text>
        <Text color={theme.light_1} fontSize={12}>
          {title}
        </Text>
      </Div>
    ),
    []
  )

  const onPressWorkout = () => (onPress ? onPress(workout) : null)

  return (
    <Div key={workout.id} bg={theme.primary.color} justifyContent="center">
      <TouchableOpacity onPress={onPressWorkout}>
        <Div
          flexDir="row"
          flex={1}
          justifyContent="center"
          alignSelf="center"
          borderBottomWidth={1}
          borderColor="rgba(255,255,255,0.4)"
          pb={4}
        >
          {workoutHandler.map((fn, i) => (
            <RenderItem {...fn(workout)} key={i} />
          ))}
        </Div>
        <B.Spacer h={16} />
      </TouchableOpacity>
    </Div>
  )
}

export default React.memo(WorkoutSummary)
