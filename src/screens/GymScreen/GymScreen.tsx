import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useDatabaseConnection } from '../../data/Connection'
import { Div, Text } from 'react-native-magnus'

type ExerciseSelect = {
  id: any
  exercise: string
  displayName: string
  muscles: string
  assistingMuscles: string
  tool: string
  custom: boolean
}

type OwnProps = {}

type Props = OwnProps

export const GymScreen: FunctionComponent<Props> = () => {
  const { exerciseSelectRepository } = useDatabaseConnection()
  // const [newExercise, setNewExercise] = useState('')
  const [exercises, setExercises] = useState<ExerciseSelect[]>([])

  // useEffect(() => {
  //   const gorb = async () => {
  //     await getRepository('exercisesSelect').save(exercisesSelect)
  //   }
  //   gorb()
  // }, [])

  useEffect(() => {
    exerciseSelectRepository.getAll().then(setExercises)
  }, [exerciseSelectRepository])

  return (
    <Div flex={1} justifyContent="center" alignItems="center">
      <Text>FDFDFDF GYMSCREEN YALL</Text>
      {exercises &&
        exercises.map(({ id, displayName, muscles }) => {
          return (
            <Div key={id} alignItems="flex-start" justifyContent="flex-end" w="100%">
              <Text>{muscles}</Text>
              <Text>{displayName}</Text>
            </Div>
          )
        })}
    </Div>
  )
}

export default GymScreen
