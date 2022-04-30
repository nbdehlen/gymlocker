import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { RouteProp } from '@react-navigation/core'
import { Collapse, Div, Icon } from 'react-native-magnus'
import { WorkoutParamList } from '../../navigation/navigationTypes'
import { ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import theme, { B } from '../../utils/theme'
import WorkoutTime from '../../components/WorkoutTime'
import SetsTable from '../../components/SetsTable'
import DraggableFlatList, { OpacityDecorator, RenderItemParams } from 'react-native-draggable-flatlist'
import { ExerciseModel } from '../../data/entities/ExerciseModel'
import CustomButton, { ButtonEnum } from '../../components/CustomButton'
import { SetModel } from '../../data/entities/SetModel'
import { useDatabaseConnection } from '../../data/Connection'
import { WorkoutModel } from '../../data/entities/WorkoutModel'
import { DeepPartial } from 'typeorm'
import ButtonGroup from '../../components/ButtonGroup'

/**
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
    // TODO: use ISOString?
    startDate: workout.start,
    endDate: new Date(workout.start.getTime() + 60 * 60 * 1000),
  })
  const [exercises, setExercises] = useState<ExerciseModel[]>(workout?.exercises || [])
  const exercisesLen = workout?.exercises?.length ?? 0
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    if (exercisesLen > 0 && !workout?.exercises?.[exercisesLen - 1].id) {
      const newId = Math.random()
      const workoutExercises = workout.exercises?.concat() || []
      workoutExercises[workoutExercises.length - 1].id = newId

      setExercises((prev) => [...prev, workoutExercises[workoutExercises.length - 1]])
      setExpand(true)
    }
  }, [workout, exercises, exercisesLen])

  const onPressSaveWorkout = async () => {
    const newWorkoutData: DeepPartial<WorkoutModel> = {
      start: dateRef.current?.startDate,
      end: dateRef.current?.endDate,
      ...(exercises && { exercises }),
      // ...(cardios && { cardios }),
      id: workout?.id,
    }

    try {
      saveWorkout(newWorkoutData)
      /**
       * Toast pre success
       */
    } catch (e) {
      console.log(e)
      /**
       * Toast fail
       * there was an error -> your workout couldn't be saved
       */
    }
  }

  const saveWorkout = async (workoutData: DeepPartial<WorkoutModel>) => {
    const { id: workoutId } = await workoutRepository.createOrUpdate(workoutData)

    const exercisePromises = exercises.map(async (ex, i) => {
      const res = await exerciseRepository.createOrUpdate({
        // TODO: Order based on flatlist drag
        ...ex,
        workout_id: workoutId,
        order: i,
      })
      return res
    })

    const exerciseP = await Promise.all(exercisePromises)

    // TODO: Restructure state since we have to call things one by one like this. Especially sets as its own state
    const setPromises = exerciseP.map(async (ex) =>
      ex.sets.map(async (set, i) => {
        await setRepository.createOrUpdate({ ...set, exercise_id: ex?.id, order: i })
      })
    )

    await Promise.all(setPromises)
  }

  const addSet = useCallback(
    (exercise: ExerciseModel | DeepPartial<ExerciseModel>, exerciseIndex: number) => {
      const newSet: DeepPartial<SetModel> = {
        id: Math.random(),
        weight_kg: 300,
        repetitions: 99,
        rir: 99,
        order: exercise?.sets?.length || 0,
        exercise_id: exercise?.id ?? Math.random(),
      }

      if (exercises?.length > 0) {
        setExercises((prev) => [
          ...prev.slice(0, exerciseIndex),
          {
            ...prev[exerciseIndex],
            sets: [...prev[exerciseIndex]!.sets!, newSet],
          },
          ...prev.slice(exerciseIndex + 1, prev?.length),
        ])
      }
    },
    [exercises]
  )

  const editSet = useCallback(
    (
      exercise: ExerciseModel | DeepPartial<ExerciseModel>,
      exerciseIndex: number,
      setIndex: number,
      set: DeepPartial<SetModel>
    ) => {
      setExercises((prev) => {
        return [
          ...prev.slice(0, exerciseIndex),
          {
            ...prev[exerciseIndex],
            sets: [
              ...prev[exerciseIndex]!.sets!.slice(0, setIndex),
              set,
              ...prev[exerciseIndex]!.sets!.slice(setIndex + 1, prev[exerciseIndex]!.sets!.length),
            ],
          },
          ...prev.slice(exerciseIndex + 1, prev?.length),
        ]
      })
    },
    []
  )

  const renderItem = useCallback(
    ({ item, drag, isActive, index }: RenderItemParams<DeepPartial<ExerciseModel>>) => {
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
              py="lg"
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
            <Collapse.Body pt="lg" pb="none">
              {item?.modifiersAvailable?.length > 0 && (
                <ButtonGroup modifiersAvailable={item.modifiersAvailable} modifiers={item?.modifiers} />
              )}
              {item?.sets && (
                <SetsTable
                  exerciseIndex={index ?? 0}
                  exercise={item}
                  editSet={editSet}
                  headers={['WEIGHT', 'REPS', 'RIR', 'EDIT']}
                />
              )}
              {/* <Div py="lg" /> */}
              <Div flexDir="row" justifyContent="center" my="lg">
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
