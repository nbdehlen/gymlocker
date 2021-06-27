import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useDatabaseConnection } from '../../data/Connection'
import { Div, Text } from 'react-native-magnus'
import { WorkoutRepository } from '../../data/repositories/WorkoutRepository'
import { getManager } from 'typeorm'
import { SetModel } from '../../data/entities/SetModel'
import { ExerciseModel } from '../../data/entities/ExerciseModel'
import { WorkoutModel } from '../../data/entities/WorkoutModel'
import { ExerciseSelectModel } from '../../data/entities/ExerciseSelectModel'
import { FlatList } from 'react-native'

type ExerciseSelect = {
  id: number
  exercise: string
  muscles: string
  assistingMuscles: string
  custom: boolean
}

type Set = {
  id: number
  exercise_id: number
  exercises: any
  order: number
  repetitions: number
  unit: string
  weight_kg: number
}

type Exercise = {
  id: number
  exercise: string
  muscles: string
  assistingMuscles: string | undefined
  order: number
  workout_id: number
  workout: any
  sets: SetModel[] | undefined
}

type OwnProps = {}

type Props = OwnProps

export const GymScreen: FunctionComponent<Props> = () => {
  const { exerciseSelectRepository, cardioRepository, workoutRepository } = useDatabaseConnection()
  // const [newExercise, setNewExercise] = useState('')
  const [exercises, setExercises] = useState<ExerciseSelectModel[]>([])
  const [workouts, setWorkouts] = useState<WorkoutModel[]>([])
  const [newMonth, setNewMonth] = useState<number[]>([])

  // await workoutRepository.getById(1, ['exercises'])

  useEffect(() => {
    workoutRepository.getAll().then(setWorkouts)
  }, [workoutRepository])

  // TODO: flatlist, scroll get more etc
  // TODO: show month if new month
  // TODO: metainfo stuff like set count, exercises or muscles?
  // cardio or str?

  return (
    <Div flex={1} justifyContent="center" alignItems="center">
      {workouts && (
        <FlatList
          data={workouts}
          renderItem={({ item }) => <WorkoutCard workout={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </Div>
  )
}

export default GymScreen

type WorkoutProps = {
  workout: WorkoutModel
}

export const WorkoutCard: FunctionComponent<WorkoutProps> = ({ workout }) => {
  console.log('exercises', workout.exercises)

  return (
    <Div>
      <Div>
        <Text>{workout.start.toString()}</Text>
      </Div>
      <Div>
        <Text>{workout.end.toString()}</Text>
      </Div>
    </Div>
  )
}
