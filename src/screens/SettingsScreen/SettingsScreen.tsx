import React, { FunctionComponent, useCallback, useState } from 'react'
import { useDatabaseConnection } from '../../data/Connection'
import { Button, Div, Icon, Text } from 'react-native-magnus'
import sampleData from '../../data/seeding/sampleData'
import { exerciseSelect as exerciseSelectJSON } from '../../data/seeding/starter/exerciseSelect'
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
import { ICreateExModData } from '../../data/repositories/ExModRepository'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { ExMod } from '../../data/entities/ExMod'
import { ExSelectModAvailable } from '../../data/entities/ExSelectModAvailable'

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
    modifierRepository,
    exSelectModAvailableRepository,
    exModRepository,
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
      const newExercises: ExerciseModel[] = []
      const exerciseSelect = await exerciseSelectRepository.getAll(['modifiersAvailable'])
      let modifiersArr: ExMod[] = []

      const promises = exerciseSelect.map(async (exercise, i) => {
        if (exerciseIndexes.includes(i)) {
          const addLen = newExercises.length
          const exLen = workout.exercises?.length || 0
          const order = addLen + exLen
          const exerciseId = uuidv4()
          const modifiers = exercise.modifiersAvailable.reduce((acc: ExMod[], cur: ExSelectModAvailable) => {
            // Flip if we add it or not:
            const randomNum = Math.random()
            if (randomNum > 0.5) {
              const modifier = {
                exerciseId,
                modifierId: cur.modifierId,
              }

              return [...acc, modifier]
            }
            return acc
          }, [])

          // Add all ExMods to an array to save the relationship later
          modifiersArr = [...modifiersArr, ...modifiers]

          newExercises.push({
            id: exerciseId,
            exercise: exercise.exercise,
            workout_id: workout.id,
            order,
            exerciseSelectId: exercise.id,
            exerciseSelect: exercise,
            sets: [],
          })
        }
      })
      await Promise.all(promises)

      if (newExercises?.length > 0) {
        const createExercises = await exerciseRepository.createMany(newExercises)
        await exModRepository.saveMany(modifiersArr)

        return createExercises
      }
      return []
    },
    [exerciseRepository, exerciseSelectRepository, exModRepository]
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
          const addLen = newCardios.length
          const cardioLen = workout.cardios?.length || 0
          const order = addLen + cardioLen

          newCardios.push({
            ...cardio,
            workout_id: workout.id,
            order,
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
        const exerciseIndexes = randomIntsFromInterval(0, exerciseSelectJSON.length - 1, exerciseCount)

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
      let prevExerciseId: string

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
    async (id: string) => {
      await workoutRepository
        .getById(id, ['exercises', 'exercises.sets', 'cardios', 'exercises.exerciseSelect'])
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

  const getExerciseById = async (id: string) => {
    await exerciseRepository
      .getById(id, ['sets'])
      .then((exercise) => exercise && console.log(JSON.stringify(exercise, null, 4)))
  }

  const getSetById = async (id: string) => {
    await workoutRepository
      .getById(id, ['exercises', 'exercises.sets'])
      .then((workout) => workout && console.log(JSON.stringify(workout, null, 4)))
  }

  const getAllWorkouts = async () => {
    await workoutRepository
      .getAll([
        'exercises',
        'exercises.sets',
        'exercises.modifiers',
        'exercises.exerciseSelect',
        'exercises.exerciseSelect.muscles',
        'exercises.exerciseSelect.assistingMuscles',
        'exercises.exerciseSelect.modifiersAvailable',
        'exercises.exerciseSelect.modifiersAvailable.modifier',
      ])
      .then(
        (workouts) =>
          workouts && console.log(JSON.stringify(workouts.slice(workouts.length - 5, workouts.length), null, 4))
      )
  }
  const deleteExerciseSelect = async () => {
    await exerciseSelectRepository.deleteAll()
    await exSelectAssistRepository.deleteAll()
    await exSelectModAvailableRepository.deleteAll()
    await muscleRepository.deleteAll()
    await exAssistRepository.deleteAll()
    await modifierRepository.deleteAll()
    await exModRepository.deleteAll()
  }

  const deleteAllWorkouts = async () => {
    await workoutRepository.deleteAll()
    await exerciseRepository.deleteAll()
    await cardioRepository.deleteAll()
    await setRepository.deleteAll()
  }

  const onPressInc = () => setWorkoutCount((prevState) => prevState + 1)
  const onPressDec = () => setWorkoutCount((prevState) => prevState - 1)

  const data = [
    { text: 'Log last 5 workouts', fn: getAllWorkouts },
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
      text: 'Delete exerciseSelect',
      fn: deleteExerciseSelect,
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
      <CustomButton onPress={item.fn} text={item.text} preset={ButtonEnum.PRIMARY} containerProps={{ w: '80%' }} />
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
