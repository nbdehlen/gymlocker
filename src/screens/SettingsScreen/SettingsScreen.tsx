import React, { FunctionComponent, useState } from 'react'
import { useDatabaseConnection } from '../../data/Connection'
import { Button, Div, Input, Text } from 'react-native-magnus'
import sampleData from '../../data/seeding/sampleData'
import theme, { B } from '../../utils/theme'
import getRandomDateWithinPeriod from '../../data/seeding/utils/getRandomDateWithinPeriod'
import { add, sub } from 'date-fns'
import { SetModel } from '../../data/entities/SetModel'
import { SetRepository } from '../../data/repositories/SetRepository'

type OwnProps = {}

type Props = OwnProps

export const SettingsScreen: FunctionComponent<Props> = () => {
  const { cardioRepository, workoutRepository, exerciseRepository, setRepository } =
    useDatabaseConnection()
  const [id, setId] = useState<number>(1)
  const [error, setError] = useState('')
  const { cardios, exercises, sets } = sampleData

  const createWorkouts = async () => {
    const startingPeriod = sub(new Date(), { days: 90, hours: 0 })
    const endingPeriod = new Date()

    const promises = [...Array(id)].map(async (_) => {
      const start = getRandomDateWithinPeriod(startingPeriod, endingPeriod)
      const end = add(start, { days: 0, hours: 2 })
      const workout = await workoutRepository.create({ start, end })

      if (workout) {
        const newExercises = exercises.map((exercise) => ({
          ...exercise,
          workout_id: workout.id,
        }))

        const createExercises = await exerciseRepository.createMany(newExercises)

        if (createExercises) {
          createExercises.map(async (exercise: any, i: number) => {
            let setsWithExerciseIds: any = []
            sets[i].map((set) => {
              setsWithExerciseIds.push({ exercise_id: exercise.id, ...set })
            })

            await setRepository.createMany(setsWithExerciseIds)
          })
        } else {
          setError('exerciseId does not exist')
        }
      } else {
        setError('workoutId does not exist')
      }
    })

    await Promise.all[promises]
  }

  const getAllWorkouts = async () => {
    await workoutRepository
      .getAll(['exercises', 'exercises.sets'])
      .then((workouts) => workouts && console.log(JSON.stringify(workouts, null, 4)))
  }

  const getWorkoutById = async () => {
    await workoutRepository
      .getById(id, ['exercises', 'exercises.sets'])
      .then((workout) => workout && console.log(JSON.stringify(workout, null, 4)))
  }

  const getExerciseById = async () => {
    await exerciseRepository
      .getById(id, ['sets'])
      .then((exercise) => exercise && console.log(JSON.stringify(exercise, null, 4)))
  }

  // const getSetById = async () => {
  //   await workoutRepository
  //     .getById(id, ['exercises', 'exercises.sets'])
  //     .then((workout) => workout && console.log(JSON.stringify(workout, null, 4)))
  // }

  const deleteAllWorkouts = async () => {
    await workoutRepository.deleteAll()
    await exerciseRepository.deleteAll()
    await cardioRepository.deleteAll()
    await setRepository.deleteAll()
  }

  // const seedWorkouts = async () => {
  //   try {
  //     const data = await workoutRepository.create(workout)
  //     console.log(data)
  //     // return data
  //   } catch (err) {
  //     setError(err)
  //     // return null
  //   }
  // }
  // const seedExercises = async () => {
  //   const workout = await workoutRepository.workoutIdExists(id)

  //   if (workout) {
  //     const newExercises = exercises.map((exercise) => ({
  //       ...exercise,
  //       workout_id: id,
  //     }))

  //     const data = await exerciseRepository.createMany(newExercises)
  //     console.log(data)
  //   } else {
  //     setError('workoutId does not exist')
  //   }
  // }

  // const seedSets = async () => {
  //   const exercise = await exerciseRepository.exerciseIdExists(id)
  //   if (exercise) {
  //     const data = await setRepository.createMany(sets)
  //     console.log(data)
  //   } else {
  //     setError('exerciseId does not exist')
  //   }
  // }

  const onPressInc = () => {
    setId((prevState) => prevState + 1)
  }
  const onPressDec = () => {
    setId((prevState) => prevState - 1)
  }

  return (
    <Div flex={1} justifyContent="center" alignItems="center" bg={theme.primary.color}>
      <Div flexDir="row">
        {error ? <Text> {error} </Text> : <B.Spacer h={40} />}
        <Button
          onPress={onPressInc}
          w={40}
          h={40}
          p={0}
          m={0}
          bg={theme.primary.onColor}
          rounded="circle">
          <Text color="white" fontSize={34}>
            +
          </Text>
        </Button>
        <B.Spacer w={8} />
        <Text color="white" fontSize={24}>
          {id}
        </Text>
        <B.Spacer w={8} />
        <Button onPress={onPressDec} w={40} h={40} p={0} m={0} rounded="circle">
          <Text color="white" fontSize={50}>
            -
          </Text>
        </Button>
      </Div>
      <B.Spacer h={16} />
      <Button onPress={createWorkouts} alignSelf="center" w={200}>
        <Text color="white">Seed DB with {id} full workouts.</Text>
      </Button>

      <B.Spacer h={16} />
      <Button onPress={getAllWorkouts} alignSelf="center">
        <Text color="white">Log all workouts</Text>
      </Button>

      <B.Spacer h={16} />
      <Button onPress={getWorkoutById} alignSelf="center">
        <Text color="white">Get workout by id {id}</Text>
      </Button>

      <B.Spacer h={16} />
      <Button onPress={getExerciseById} alignSelf="center">
        <Text color="white">Get exercise by id {id}</Text>
      </Button>

      <B.Spacer h={16} />
      <Button onPress={deleteAllWorkouts} alignSelf="center">
        <Text color="white">Delete all workouts</Text>
      </Button>
    </Div>
  )
}

export default SettingsScreen
