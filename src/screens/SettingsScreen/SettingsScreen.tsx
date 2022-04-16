import React, { FunctionComponent, useCallback, useState } from 'react'
import { useDatabaseConnection } from '../../data/Connection'
import { Button, Div, Icon, Text } from 'react-native-magnus'
import sampleData from '../../data/seeding/sampleData'
import { exerciseSelect } from '../../data/seeding/starter/exerciseSelect'
import theme, { B } from '../../utils/theme'
import getRandomDateWithinPeriod from '../../data/seeding/utils/getRandomDateWithinPeriod'
import { add, sub } from 'date-fns'
import { SetModel } from '../../data/entities/SetModel'
import { WorkoutModel } from '../../data/entities/WorkoutModel'
import { ExerciseModel } from '../../data/entities/ExerciseModel'
import { CardioModel } from '../../data/entities/CardioModel'
import { ICreateCardioData } from '../../data/repositories/CardioRepository'
import { ICreateExerciseData } from '../../data/repositories/ExerciseRepository'
import { clearAsyncStorage, logAsyncStorage } from '../../utils/asyncStorage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, ListRenderItem } from 'react-native'
import CustomButton, { ButtonEnum } from '../../components/CustomButton'
import { ICreateExAssistData } from '../../data/repositories/ExAssistRepository'

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
  MIX = 'mix',
}

type OwnProps = {}

type Props = OwnProps

export const SettingsScreen: FunctionComponent<Props> = () => {
  const {
    cardioRepository,
    workoutRepository,
    exerciseRepository,
    setRepository,
    exerciseSelectRepository,
    muscleRepository,
    exSelectAssistRepository,
    exAssistRepository,
  } = useDatabaseConnection()
  const [workoutCount, setWorkoutCount] = useState(1)
  const [fromDaysBack, setFromDaysBack] = useState(90)

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
      let order = 0
      const assistingMusclesData: number[][] = []

      const promises = exerciseSelect.map(async (exercise, i) => {
        if (exerciseIndexes.includes(i)) {
          // Convert muscles string to MuscleModel
          const musclesData = await muscleRepository.getByNames([exercise.muscles])

          newExercises.push({
            exercise: exercise.exercise,
            muscles: musclesData[0],
            workout_id: workout.id,
            order,
          })
          order += 1

          // Save Ids for assisting muscles
          const assistingMuscleModels = await muscleRepository.getByNames(exercise.assistingMuscles)
          assistingMusclesData.push(assistingMuscleModels.map((ast) => ast.id))
        }
      })
      await Promise.all(promises)

      if (newExercises?.length > 0) {
        const createExercises = await exerciseRepository.createMany(newExercises)

        const exAssistIds: ICreateExAssistData[] = []

        assistingMusclesData.forEach((muscleArr, i) => {
          // Extract the muscleIds from the nested arrays of muscleId and pair with it's exerciseId.
          muscleArr.forEach((muscleId) => {
            exAssistIds.push({
              exerciseId: createExercises[i].id,
              muscleId,
            })
          })
        })

        await exAssistRepository.saveMany(exAssistIds)

        return createExercises
      }
      return []
    },
    [exerciseRepository, muscleRepository, exAssistRepository]
  )

  const addSetsToExercise = useCallback(
    async (exercise: ExerciseModel, setArray: number): Promise<SetModel[]> => {
      let setsWithExerciseIds: any[] = []
      sampleData.sets[setArray].forEach((set) => {
        setsWithExerciseIds.push({ exerciseId: exercise.id, ...set })
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
            workout_id: workout.id,
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
        const exerciseIndexes = randomIntsFromInterval(0, exerciseSelect.length - 1, exerciseCount)

        const exercises = await addExercisesToWorkout(workout, exerciseIndexes)
        return exercises
      })

      const exercises = await Promise.all(exercisePromises)
      const res = exercises.flat()
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

  const getWorkoutById = useCallback(
    async (id: number) => {
      await workoutRepository
        .getById(id, [
          'exercises',
          'exercises.sets',
          'cardios',
          'exercises.muscles',
          'exercises.assistingMuscles',
          'exercises.assistingMuscles.assistingMuscle',
        ])
        .then((w) => w && console.log(JSON.stringify(w, null, 2)))
    },
    [workoutRepository]
  )

  const getWorkoutsByIds = useCallback(
    async (workouts: WorkoutModel[]) => {
      const promises = workouts.map(async (workout) => await getWorkoutById(workout.id))
      const res = await Promise.all(promises)
      const resFlat = res.flat()
      return resFlat
    },
    [getWorkoutById]
  )

  const createCompleteWorkoutsInSteps = useCallback(
    async (type: WorkoutEnum): Promise<void> => {
      const workouts = await createWorkouts(workoutCount, fromDaysBack)

      if ([WorkoutEnum.EXERCISE, WorkoutEnum.MIX].includes(type)) {
        const exercises = await addExercisesToWorkouts(workouts)
        await addSetsToExercises(exercises)
      }
      if ([WorkoutEnum.CARDIO, WorkoutEnum.MIX].includes(type)) {
        await addCardiosToWorkouts(workouts)
      }
      await getWorkoutsByIds(workouts)
    },
    [
      createWorkouts,
      addExercisesToWorkouts,
      addSetsToExercises,
      addCardiosToWorkouts,
      getWorkoutsByIds,
      workoutCount,
      fromDaysBack,
    ]
  )

  const getExerciseById = async (id: number) => {
    await exerciseRepository
      .getById(id, ['sets'])
      .then((exercise) => exercise && console.log(JSON.stringify(exercise, null, 4)))
  }

  const getSetById = async (id: number) => {
    await workoutRepository
      .getById(id, ['exercises', 'exercises.sets'])
      .then((workout) => workout && console.log(JSON.stringify(workout, null, 4)))
  }

  const getAllWorkouts = async () => {
    await workoutRepository
      .getAll([
        'exercises',
        'exercises.sets',
        'cardios',
        'exercises.muscles',
        'exercises.assistingMuscles',
        'exercises.assistingMuscles.assistingMuscle',
      ])
      .then((workouts) => workouts && console.log(JSON.stringify(workouts, null, 4)))
  }

  const deleteAllWorkouts = async () => {
    await workoutRepository.deleteAll()
    await exerciseRepository.deleteAll()
    await cardioRepository.deleteAll()
    await setRepository.deleteAll()
    await exerciseSelectRepository.deleteAll()
    await muscleRepository.deleteAll()
    await exSelectAssistRepository.deleteAll()
    await exAssistRepository.deleteAll()
  }

  const onPressInc = () => setWorkoutCount((prevState) => prevState + 1)
  const onPressDec = () => setWorkoutCount((prevState) => prevState - 1)

  const data = [
    {
      text: 'Log workout by id',
      fn: () => getWorkoutById(workoutCount),
    },
    {
      text: 'Log exercise by id',
      fn: () => getExerciseById(workoutCount),
    },
    { text: 'Log all workouts', fn: getAllWorkouts },
    {
      text: `Add ${workoutCount} random strength workouts`,
      fn: () => createCompleteWorkoutsInSteps(WorkoutEnum.EXERCISE),
    },
    {
      text: `Add ${workoutCount} random cardio workouts`,
      fn: () => createCompleteWorkoutsInSteps(WorkoutEnum.CARDIO),
    },
    {
      text: `Add ${workoutCount} random mixed workouts`,
      fn: () => createCompleteWorkoutsInSteps(WorkoutEnum.MIX),
    },
    {
      text: 'Delete all workouts',
      fn: deleteAllWorkouts,
    },
    {
      text: 'Clear Storage',
      fn: () => clearAsyncStorage(),
    },
    {
      text: 'Log storage',
      fn: () => logAsyncStorage(),
    },
  ]

  const Header = useCallback(
    () => (
      <Div flexDir="row">
        <B.Spacer h={40} />
        <Button
          onPress={onPressInc}
          w={60}
          h={60}
          p={0}
          m={0}
          bg={theme.primary.color}
          borderWidth={1}
          borderColor={theme.primary.onColor}
          rounded="circle"
        >
          <Icon fontSize={32} fontFamily="AntDesign" name="plus" color={theme.primary.onColor} />
        </Button>
        <B.Spacer w={16} />
        <Text color="white" fontSize={40}>
          {workoutCount}
        </Text>
        <B.Spacer w={16} />
        <Button
          onPress={onPressDec}
          w={60}
          h={60}
          p={0}
          m={0}
          bg={theme.primary.color}
          borderWidth={1}
          borderColor={theme.primary.onColor}
          rounded="circle"
        >
          <Icon fontSize={32} fontFamily="AntDesign" name="minus" color={theme.primary.onColor} />
        </Button>
      </Div>
    ),
    [workoutCount]
  )

  type ItemProps = {
    text: string
    fn: () => void
  }

  const renderItem: ListRenderItem<ItemProps> = useCallback(
    ({ item }) => (
      <Div alignItems="center">
        <CustomButton onPress={item.fn} text={item.text} preset={ButtonEnum.PRIMARY} containerProps={{ w: '80%' }} />
      </Div>
    ),
    []
  )

  return (
    <SafeAreaView style={{ backgroundColor: theme.primary.color, flex: 1 }}>
      <FlatList
        data={data}
        ListHeaderComponent={<Header />}
        ListHeaderComponentStyle={{ alignItems: 'center', marginVertical: 20 }}
        ItemSeparatorComponent={() => <B.Spacer h={24} />}
        renderItem={renderItem}
        keyExtractor={(_, i) => String(i)}
      />
    </SafeAreaView>
  )
}

export default React.memo(SettingsScreen)
