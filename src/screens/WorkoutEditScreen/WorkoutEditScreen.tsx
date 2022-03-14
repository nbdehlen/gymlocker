import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { RouteProp } from '@react-navigation/core'
import { Collapse, Div, Icon } from 'react-native-magnus'
import { WorkoutParamList } from '../../navigation/navigationTypes'
import { ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import theme, { B } from '../../utils/theme'
import WorkoutTime from '../../components/WorkoutTime'
import SetsTable from '../../components/SetsTable'
import DraggableFlatList, { OpacityDecorator, RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import { ExerciseModel } from '../../data/entities/ExerciseModel'
import CustomButton, { ButtonEnum } from '../../components/CustomButton'
import { ICreateExerciseData } from '../../data/repositories/ExerciseRepository'
import { SetModel } from '../../data/entities/SetModel'
import { ICreateSetData } from '../../data/repositories/SetRepository'
import { useDatabaseConnection } from '../../data/Connection'

/**
 * fix order
 * #################
 * add cardios,
 * #################
 * onPress edit set (lock icon) should scroll to it. Otherwise when you press an input it will scroll when
 * keyboard opens up and it's not smooth.
 * #################
 * Swipe on Calendar workouts list to edit,
 * onPress to open modal from bottom
 * onPress or something on exercise to see the muscles involved etc
 */

type OwnProps = {}

type Props = OwnProps & {
  route: RouteProp<WorkoutParamList, ScreenRoute.WORKOUT_EDIT>
}

// IDEA: onSwipeLeft/right - delete button, undo?  different for if in edit mode?
export const WorkoutEditScreen: FunctionComponent<Props> = ({ route }) => {
  const { workoutRepository, exerciseRepository, setRepository } = useDatabaseConnection()
  const { workout } = route.params
  const dateRef = useRef({
    startDate: workout.start,
    endDate: new Date(workout.start.getTime() + 60 * 60 * 1000),
  })
  const [exercises, setExercises] = useState<(ExerciseModel | ICreateExerciseData)[]>(workout?.exercises || [])
  const workoutExercisesLen = workout?.exercises?.length > 0 ? workout.exercises.length : 0
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    if (workout?.exercises?.length > 0 && workout?.exercises[workoutExercisesLen - 1]?.id == null) {
      const newId = Math.floor(Math.random() * 100000000 + 100000)
      const workoutExercises = workout?.exercises.concat()
      workoutExercises[workoutExercises.length - 1].id = newId

      setExercises((prev) => [...prev, workoutExercises[workoutExercises.length - 1]])
      setExpand(true)
    }
  }, [workout, exercises, workoutExercisesLen])

  const onPressSaveWorkout = async () => {
    const isNewWorkout = !!(await workoutRepository.getById(workout?.id))
    if (isNewWorkout) {
      const { start, end, cardios } = workout
      const newWorkout = await workoutRepository.create({
        start,
        end,
      })

      const newWorkoutExercises = exercises.map((ex, i) => ({
        workout_id: newWorkout?.id,
        assistingMuscles: ex.assistingMuscles,
        exercise: ex.exercise,
        muscles: ex.muscles,
        // TODO: Order based on flatlist drag
        order: ex.order ?? i,
      }))
      const addedExercises = await exerciseRepository.createMany(newWorkoutExercises)

      const addSetsToExercises = async (exerciseState: ExerciseModel[], savedExercises: ExerciseModel[]) => {
        let setsWithExerciseIds: ICreateSetData[] = []
        exerciseState.forEach((ex, i) => {
          ex.sets.forEach((set) => {
            // TODO: Do I even need this id?
            const { id, ...rest } = set
            setsWithExerciseIds.push({ ...rest, exercise_id: savedExercises[i].id })
          })
        })
        console.log(JSON.stringify(setsWithExerciseIds, null, 2))
        const sets = await setRepository.createMany(setsWithExerciseIds)
        return sets
      }

      addSetsToExercises(exercises, addedExercises)
    } else {
      // TODO: edit sets here
    }
  }

  const addSet = useCallback(
    (exercise: ExerciseModel | ICreateExerciseData, exerciseIndex: number) => {
      const newSet = {
        id: Math.random(),
        weight_kg: 300,
        repetitions: 99,
        order: 10,
        exercise_id: exercise?.id ?? Math.random(),
        // exercise,
      }

      if (exercises?.length > 0) {
        console.log('ADD SET')
        setExercises((prev) => [
          ...prev.slice(0, exerciseIndex),
          {
            ...prev[exerciseIndex],
            sets: [...prev[exerciseIndex].sets, newSet],
          },
          ...prev.slice(exerciseIndex + 1, prev?.length),
        ])
      }
    },
    [exercises]
  )

  const editSet = useCallback(
    (
      exercise: ExerciseModel | ICreateExerciseData,
      exerciseIndex: number,
      setIndex: number,
      set: SetModel | ICreateSetData
    ) => {
      setExercises((prev) => [
        ...prev.slice(0, exerciseIndex),
        {
          ...prev[exerciseIndex],
          sets: [
            ...prev[exerciseIndex].sets.slice(0, setIndex),
            set,
            ...prev[exerciseIndex].sets.slice(setIndex + 1, prev[exerciseIndex].sets.length),
          ],
        },
        ...prev.slice(exerciseIndex + 1, prev?.length),
      ])
      console.log({ setLen: exercises[exerciseIndex].sets.length })
    },
    [exercises]
  )

  const renderItem = useCallback(
    ({ item, drag, isActive, index }: RenderItemParams<ExerciseModel | ICreateExerciseData>) => {
      const onPressAddSet = () => index != null && addSet(item, index)
      const IconUp = () => <Icon name="up" fontFamily="AntDesign" fontSize="sm" color={theme.light_1} />
      const IconDown = () => <Icon name="down" fontFamily="AntDesign" fontSize="sm" color={theme.light_1} />
      const handleDrag = () => {
        setExpand(false)
        drag()
      }

      return (
        <OpacityDecorator>
          <Collapse bg="transparent" defaultActive={expand} mt="none">
            <Collapse.Header
              bg="transparent"
              py="xl"
              prefix={null}
              suffix={<IconDown />}
              activeSuffix={<IconUp />}
              onLongPress={handleDrag}
              flexDir="row"
              justifyContent="space-between"
            >
              <B.LightText fontWeight="bold" fontSize={14}>
                {item?.exercise}
              </B.LightText>
              <B.Spacer w={8} />
            </Collapse.Header>
            <Collapse.Body pt="xl" pb="none">
              {item?.sets && (
                <SetsTable
                  exerciseIndex={index}
                  exercise={item}
                  editSet={editSet}
                  headers={['WEIGHT', 'REPS', 'EDIT']}
                />
              )}
              {/* <Div py="lg" /> */}
              <Div flexDir="row" justifyContent="center" my="xl">
                <CustomButton
                  text="Add set"
                  onPress={onPressAddSet}
                  preset={ButtonEnum.PRIMARY}
                  IconComponent={() => (
                    <Icon fontSize="xl" fontFamily="AntDesign" name="plus" ml="sm" color={theme.primary.onColor} />
                  )}
                  iconSuffix
                />
              </Div>
            </Collapse.Body>
          </Collapse>
        </OpacityDecorator>
      )
    },
    [addSet, editSet, expand]
  )

  return (
    <DraggableFlatList
      containerStyle={{ flex: 1, backgroundColor: theme.primary.color, paddingHorizontal: 20 }}
      ListHeaderComponentStyle={{ marginBottom: 20 }}
      ListHeaderComponent={<WorkoutTime forwardedRef={dateRef} />}
      ListFooterComponentStyle={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}
      ListFooterComponent={
        <CustomButton
          onPress={onPressSaveWorkout}
          text="Save workout"
          preset={ButtonEnum.PRIMARY}
          containerProps={{ flex: 1 }}
        />
      }
      data={exercises}
      onDragEnd={({ data }) => setExercises(data)}
      keyExtractor={(item, index) => `${item?.id ?? ''} ${item.exercise} ${index}`}
      renderItem={renderItem}
    />
  )
}

export default React.memo(WorkoutEditScreen)
