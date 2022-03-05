import React, { FunctionComponent, useCallback, useState } from 'react'
import { useDatabaseConnection } from '../../data/Connection'
import { Button, Div, Icon, Input, Text } from 'react-native-magnus'
import sampleData from '../../data/seeding/sampleData'
import theme, { B } from '../../utils/theme'
import getRandomDateWithinPeriod from '../../data/seeding/utils/getRandomDateWithinPeriod'
import { add, sub } from 'date-fns'
import { SetModel } from '../../data/entities/SetModel'
import { SetRepository } from '../../data/repositories/SetRepository'
import { WorkoutModel } from '../../data/entities/WorkoutModel'
import { ExerciseModel } from '../../data/entities/ExerciseModel'
import { CardioModel } from '../../data/entities/CardioModel'
import { ICreateCardioData } from '../../data/repositories/CardioRepository'
import { ICreateExerciseData } from '../../data/repositories/ExerciseRepository'

const randomIntFromInterval = (min: number, max: number): number => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const randomIntsFromInterval = (min: number, max: number, count: number): number[] => {
  return [...Array(count)].map((_) => randomIntFromInterval(min, max))
}

enum WorkoutEnum {
  EXERCISE = 'exercise',
  CARDIO = 'cardio',
  MIX = 'mix'
}

type OwnProps = {}

type Props = OwnProps

export const SettingsScreen: FunctionComponent<Props> = () => {
  const { cardioRepository, workoutRepository, exerciseRepository, setRepository } = useDatabaseConnection()
  // const [count, setCount] = useState<number>(1) // should be named count
  const [workoutCount, setWorkoutCount] = useState(1)
  const [workoutsFrom, setWorkoutsFrom] = useState(90)

  // const { cardios, exercises, sets } = sampleData

  // const createWorkouts = async () => {
  //   const startingPeriod = sub(new Date(), { days: 90, hours: 0 })
  //   const endingPeriod = new Date()

  //   const promises = [...Array(id)].map(async (_) => {
  //     const start = getRandomDateWithinPeriod(startingPeriod, endingPeriod)
  //     const end = add(start, { days: 0, hours: 2 })
  //     const workout = await workoutRepository.create({ start, end })
  //     return workout

  //     if () {
  //       const newExercises = exercises.map((exercise) => ({
  //         ...exercise,
  //         workout_id: workout.id
  //       }))

  //       const createExercises = await exerciseRepository.createMany(newExercises)

  //       if (createExercises) {
  //         createExercises.map(async (exercise: any, i: number) => {
  //           let setsWithExerciseIds: any = []
  //           sets[i].map((set) => {
  //             setsWithExerciseIds.push({ exercise_id: exercise.id, ...set })
  //           })

  //           await setRepository.createMany(setsWithExerciseIds)
  //         })
  //       } else {
  //         setError('exerciseId does not exist')
  //       }
  //     } else {
  //       setError('workoutId does not exist')
  //     }
  //   })

  //   await Promise.all[promises]
  // }

  const createWorkouts = useCallback(
    async (count: number, startingFrom: number): Promise<WorkoutModel[]> => {
      const startingPeriod = sub(new Date(), { days: startingFrom, hours: 0 })
      const endingPeriod = new Date()

      const promises = [...Array(count)].map(async (_): Promise<WorkoutModel> => {
        const start = getRandomDateWithinPeriod(startingPeriod, endingPeriod)
        // TODO: This needs fixin
        const end = add(start, { days: 0, hours: 2 })
        const workout = await workoutRepository.create({ start, end })
        return workout
      })

      const workouts = await Promise.all(promises)
      return workouts
    },
    [workoutRepository]
  )

  const addExercisesToWorkout = useCallback(
    async (workout: WorkoutModel, exerciseIndexes: number[]): Promise<ExerciseModel[]> => {
      const newExercises: ICreateExerciseData[] = []
      sampleData.exercises.forEach((exercise, i) => {
        if (exerciseIndexes.includes(i)) {
          newExercises.push({
            ...exercise,
            workout_id: workout.id
          })
        }
      })

      if (newExercises?.length > 0) {
        const createExercises = await exerciseRepository.createMany(newExercises)
        return createExercises
      }
      return []
    },
    [exerciseRepository]
  )

  const addSetsToExercise = useCallback(
    async (exercise: ExerciseModel, setArray: number): Promise<SetModel[]> => {
      let setsWithExerciseIds: any[] = []
      sampleData.sets[setArray].forEach((set) => {
        setsWithExerciseIds.push({ exercise_id: exercise.id, ...set })
      })
      const sets = await setRepository.createMany(setsWithExerciseIds)
      return sets
    },
    [setRepository]
  )

  const addCardiosToWorkout = useCallback(
    async (workout: WorkoutModel, cardioIndexes: number[]): Promise<CardioModel[] | []> => {
      const newCardios: ICreateCardioData[] = []
      sampleData.cardios.forEach((cardio, i) => {
        if (cardioIndexes.includes(i)) {
          newCardios.push({
            ...cardio,
            workout_id: workout.id
          })
        }
      })

      if (newCardios.length > 0) {
        const createCardio = await cardioRepository.createMany(newCardios)
        return createCardio
      }
      return []
    },
    [cardioRepository]
  )

  const addExercisesToWorkouts = useCallback(
    async (workouts: WorkoutModel[]) => {
      const exercisePromises = workouts.map(async (workout) => {
        const exerciseCount = randomIntFromInterval(1, 6)
        const exerciseIndexes = randomIntsFromInterval(0, sampleData.exercises.length - 1, exerciseCount)

        const exercises = await addExercisesToWorkout(workout, exerciseIndexes)
        return exercises
      })

      const exercises = await Promise.all(exercisePromises)
      const res = exercises.flat()
      // console.log({ res })
      return res
    },
    [addExercisesToWorkout]
  )

  const addSetsToExercises = useCallback(
    async (exercises: ExerciseModel[]) => {
      let setArray: number
      let prevExerciseId: number

      const setsPromises = exercises.map(async (exercise) => {
        // setArray update only on exercise change
        if (exercise.id !== prevExerciseId) {
          prevExerciseId = exercise.id
          setArray = randomIntFromInterval(0, sampleData.sets.length - 1)
        }
        return await addSetsToExercise(exercise, setArray)
      })
      const sets = await Promise.all(setsPromises)
      const res = sets.flat()
      return res
    },
    [addSetsToExercise]
  )

  const addCardiosToWorkouts = useCallback(
    async (workouts: WorkoutModel[]) => {
      const workoutPromises = workouts.map(async (workout) => {
        const cardiosCount = randomIntFromInterval(1, 3)
        const cardioIndexes = randomIntsFromInterval(0, sampleData.cardios.length - 1, cardiosCount)
        return await addCardiosToWorkout(workout, cardioIndexes)
      })

      const cardios = await Promise.all(workoutPromises)
      const res = cardios.flat()
      return res
    },
    [addCardiosToWorkout]
  )

  const getWorkoutsByIds = async (workouts: WorkoutModel[]) => {
    const promises = workouts.map(async (workout) => await getWorkoutById(workout.id))
    const res = await Promise.all(promises)
    const resFlat = res.flat()
    return resFlat
  }

  const createCompleteWorkoutsInSteps = useCallback(
    async (type: WorkoutEnum): Promise<void> => {
      const workouts = await createWorkouts(workoutCount, workoutsFrom)

      if ([WorkoutEnum.EXERCISE, WorkoutEnum.MIX].includes(type)) {
        const exercises = await addExercisesToWorkouts(workouts)
        await addSetsToExercises(exercises)
      }
      if ([WorkoutEnum.CARDIO, WorkoutEnum.MIX].includes(type)) {
        await addCardiosToWorkouts(workouts)
      }
      // const res = await getWorkoutsByIds(workouts)
    },
    [createWorkouts, addExercisesToWorkouts, addSetsToExercises, addCardiosToWorkouts, workoutCount, workoutsFrom]
  )

  // const getExerciseById = async () => {
  //   await exerciseRepository
  //     .getById(id, ['sets'])
  //     .then((exercise) => exercise && console.log(JSON.stringify(exercise, null, 4)))
  // }

  // const getSetById = async () => {
  //   await workoutRepository
  //     .getById(id, ['exercises', 'exercises.sets'])
  //     .then((workout) => workout && console.log(JSON.stringify(workout, null, 4)))
  // }

  const getAllWorkouts = async () => {
    await workoutRepository
      .getAll(['exercises', 'exercises.sets'])
      .then((workouts) => workouts && console.log(JSON.stringify(workouts, null, 4)))
  }

  const getWorkoutById = async (id: number) => {
    const workout = await workoutRepository.getById(id, ['exercises', 'exercises.sets', 'cardios'])
    // .then((workout) => workout && console.log(JSON.stringify(workout, null, 4)))
    return workout
  }

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

  const onPressCreateExerciseWorkouts = () => createCompleteWorkoutsInSteps(WorkoutEnum.EXERCISE)
  const onPressCreateCardioWorkouts = () => createCompleteWorkoutsInSteps(WorkoutEnum.CARDIO)
  const onPressCreateMixWorkouts = () => createCompleteWorkoutsInSteps(WorkoutEnum.MIX)
  const onPressInc = () => setWorkoutCount((prevState) => prevState + 1)
  const onPressDec = () => setWorkoutCount((prevState) => prevState - 1)

  return (
    <Div flex={1} justifyContent="center" alignItems="center" bg={theme.primary.color}>
      <Div flexDir="row">
        <B.Spacer h={40} />
        <Button onPress={onPressInc} w={40} h={40} p={0} m={0} bg={theme.primary.onColor} rounded="circle">
          <Icon fontSize={24} fontFamily="AntDesign" name="plus" color={theme.light_1} />
        </Button>
        <B.Spacer w={8} />
        <Text color="white" fontSize={24}>
          {workoutCount}
        </Text>
        <B.Spacer w={8} />
        <Button onPress={onPressDec} w={40} h={40} p={0} m={0} rounded="circle">
          <Icon fontSize={24} fontFamily="AntDesign" name="minus" color={theme.light_1} />
        </Button>
      </Div>
      <B.Spacer h={16} />
      <Button onPress={onPressCreateExerciseWorkouts} alignSelf="center">
        <Text color="white">Add {workoutCount} random strength workouts</Text>
      </Button>
      <B.Spacer h={16} />
      <Button onPress={onPressCreateCardioWorkouts} alignSelf="center">
        <Text color="white">Add {workoutCount} random cardio workouts</Text>
      </Button>
      <B.Spacer h={16} />
      <Button onPress={onPressCreateMixWorkouts} alignSelf="center">
        <Text color="white">add {workoutCount} random mixed focus workouts</Text>
      </Button>

      <B.Spacer h={16} />
      <Button onPress={getAllWorkouts} alignSelf="center">
        <Text color="white">Log all workouts</Text>
      </Button>

      {/* <B.Spacer h={16} />
      <Button onPress={getWorkoutById} alignSelf="center">
        <Text color="white">Get workout by id {id}</Text>
      </Button> */}

      {/* <B.Spacer h={16} />
      <Button onPress={getExerciseById} alignSelf="center">
        <Text color="white">Get exercise by id {id}</Text>
      </Button> */}

      <B.Spacer h={16} />
      <Button onPress={deleteAllWorkouts} alignSelf="center">
        <Text color="white">Delete all workouts</Text>
      </Button>
    </Div>
  )
}

export default SettingsScreen
