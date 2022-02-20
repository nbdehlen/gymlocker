import React, { FunctionComponent, useCallback } from 'react'
import { TouchableOpacity } from 'react-native'
import { WorkoutModel } from '../data/entities/WorkoutModel'
import theme, { B } from '../utils/theme'
import { Div, Text } from 'react-native-magnus'
import { differenceInMinutes } from 'date-fns'

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
  const getTotalSets = useCallback((workout: WorkoutModel, i: number) => {
    const exercises =
      workout?.exercises && workout.exercises.map((exercise) => exercise.sets).reduce((acc, cur) => acc.concat(cur), [])

    const data = exercises ? exercises?.length : '-'
    const title = 'sets'

    return <RenderItem data={data} title={title} key={i} />
  }, [])

  const getTotalCalories = useCallback((workout: WorkoutModel, i: number) => {
    const data = workout?.cardios && workout.cardios.map((cardio) => cardio.calories).reduce((acc, cur) => acc + cur)
    const title = 'cal'

    return <RenderItem data={data || '-'} title={title} key={i} />
  }, [])

  const getTotalDistance = useCallback((workout: WorkoutModel, i: number) => {
    const data =
      workout?.cardios && workout.cardios.map((cardio) => cardio.distance_m).reduce((acc, cur) => acc + cur) / 1000
    const title = 'km'

    return <RenderItem data={data || '-'} title={title} key={i} />
  }, [])

  const getTotalWorkoutDuration = useCallback((workout: WorkoutModel, i: number) => {
    const data = differenceInMinutes(workout.end, workout.start)
    const title = 'min'

    return <RenderItem data={data} title={title} key={i} />
  }, [])

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
          pb={4}
        >
          {workoutHandler.map((fn, i) => fn(workout, i))}
        </Div>
        <B.Spacer h={16} />
      </TouchableOpacity>
    </Div>
  )
}

export default React.memo(WorkoutSection)
