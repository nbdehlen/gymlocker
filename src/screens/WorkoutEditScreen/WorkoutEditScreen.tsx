import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { RouteProp, useNavigation } from '@react-navigation/core'
import { Collapse, Div, Icon, Snackbar, SnackbarRef } from 'react-native-magnus'
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
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { ExMod } from '../../data/entities/ExMod'
import { TouchableOpacity } from 'react-native'

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

const snackbarRef = React.createRef<SnackbarRef>()

type OwnProps = {}

type Props = OwnProps & {
  route: RouteProp<WorkoutParamList, ScreenRoute.WORKOUT_EDIT>
}

// TODO: when editing, workouts are not updated in details and calendar
// IDEA: onSwipeLeft/right - delete button, undo?  different for if in edit mode?
export const WorkoutEditScreen: FunctionComponent<Props> = ({ route }) => {
  const { workoutRepository, exerciseRepository, setRepository, exModRepository } = useDatabaseConnection()
  const { workout, type } = route.params
  const dateRef = useRef({
    // TODO: use ISOString?
    startDate: workout.start,
    endDate: new Date(workout.start.getTime() + 60 * 60 * 1000),
  })
  const [exercises, setExercises] = useState<ExerciseModel[]>(workout?.exercises || [])
  const [expand, setExpand] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    const hasExercises = exercises?.length > 0 || workout.exercises?.length > 0
    const lastWorkoutExerciseId = workout?.exercises[workout?.exercises.length - 1]?.id

    // TODO: separate new exercise and workout when sending from drawer?
    if (hasExercises && !exercises.find((ex) => ex?.id === lastWorkoutExerciseId) && type === 'add_exercise') {
      setExercises((prevExercises) => [...prevExercises, workout?.exercises[workout?.exercises.length - 1]])
      setExpand(true)
    }
  }, [workout, exercises, type])

  const onPressAddMenu = () => {
    navigation.openDrawer()
  }

  const onPressSaveWorkout = async () => {
    const newWorkoutData: WorkoutModel = {
      start: dateRef.current?.startDate,
      end: dateRef.current?.endDate,
      ...(exercises && { exercises }),
      // ...(cardios && { cardios }),
      id: workout?.id,
    }

    try {
      await saveWorkout(newWorkoutData)
      if (snackbarRef.current) {
        snackbarRef.current.show('Workout saved!', {
          duration: 2000,
          suffix: <Icon name="checkcircle" color="white" fontSize="2xl" fontFamily="AntDesign" />,
          style: { backgroundColor: '#27a731' },
        })
      }
    } catch (e) {
      console.log(e)
      if (snackbarRef.current) {
        snackbarRef.current.show('There was an error saving your workout, please try again!', {
          duration: 2000,
          suffix: <Icon name="closecircleo" color="white" fontSize="2xl" fontFamily="AntDesign" />,
          style: { backgroundColor: '#a32222' },
        })
      }
    }
  }

  const addModsToExercise = (exerciseIndex: number, modifiers: ExMod[]) => {
    setExercises((prev) => {
      return [
        ...prev.slice(0, exerciseIndex),
        {
          ...prev[exerciseIndex],
          modifiers,
        },
        ...prev.slice(exerciseIndex + 1, prev?.length),
      ]
    })
  }

  const saveWorkout = async (workoutData: WorkoutModel) => {
    await workoutRepository.createOrUpdate(workoutData)

    const exercisePromises = exercises.map(async (ex: ExerciseModel, i) => {
      // Modifiers needs to be saved separately as some can be deleted and some added
      const res = await exerciseRepository.createOrUpdate({
        id: ex.id,
        workout_id: ex.workout_id,
        exercise: ex.exercise,
        exerciseSelectId: ex.exerciseSelectId,
        order: i,
        sets: ex.sets,
      })
      return res
    })

    const exerciseP = await Promise.all(exercisePromises)

    // TODO: Restructure state since we have to call things one by one like this.
    // Especially sets as its own state
    const setPromises = exerciseP.map(async (ex, i) => {
      ex.sets.map(async (set, i) => {
        await setRepository.createOrUpdate({ ...set, exerciseId: ex?.id, order: i })
      })

      // Removing unwanted mods and saving the ones selected
      await exModRepository.updateExModsForExercise(exercises?.[i]?.modifiers, ex?.id)
    })

    await Promise.all(setPromises)
  }

  // TODO: Fix 0kg for bodyweight exercises (like rir maybe?)
  // TODO: Fix smart default values of previous set or previous this exercise
  const addSet = useCallback(
    (exercise: ExerciseModel | DeepPartial<ExerciseModel>, exerciseIndex: number) => {
      const newSet: DeepPartial<SetModel> = {
        id: uuidv4(),
        weight_kg: 300,
        repetitions: 99,
        rir: 99,
        order: exercise?.sets?.length || 0,
        exerciseId: exercise?.id,
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
              {item?.exerciseSelect?.modifiersAvailable?.length > 0 && (
                <ButtonGroup
                  modifiersAvailable={item.exerciseSelect.modifiersAvailable}
                  modifiers={item?.modifiers}
                  exerciseIndex={index!}
                  exerciseId={item.id}
                  addModsToExercise={addModsToExercise}
                />
              )}
              {item?.sets && (
                <SetsTable
                  exerciseIndex={index ?? 0}
                  exercise={item}
                  editSet={editSet}
                  headers={['WEIGHT', 'REPS', 'RIR', 'EDIT']}
                />
              )}
              <CustomButton
                text="Add set"
                onPress={onPressAddSet}
                preset={ButtonEnum.PRIMARY}
                IconComponent={() => (
                  <Icon fontSize="xl" fontFamily="AntDesign" name="plus" ml="sm" color={theme.primary.onColor} />
                )}
                iconSuffix
                containerProps={{ w: '40%' }}
              />
            </Collapse.Body>
          </Collapse>
        </OpacityDecorator>
      )
    },
    [addSet, editSet, expand]
  )

  return (
    <Div flex={1}>
      <DraggableFlatList
        containerStyle={{ flex: 1, backgroundColor: theme.primary.color, paddingHorizontal: 20 }}
        ListHeaderComponentStyle={{ marginBottom: 20 }}
        ListHeaderComponent={<WorkoutTime forwardedRef={dateRef} />}
        ListFooterComponentStyle={{ marginTop: 20 }}
        ListFooterComponent={
          <CustomButton
            onPress={onPressSaveWorkout}
            text="Save workout"
            preset={ButtonEnum.PRIMARY}
            containerProps={{ w: '100%' }}
          />
        }
        data={exercises}
        onDragEnd={({ data }) => setExercises(data)}
        keyExtractor={(item, index) => `${item?.id ?? ''} ${item.exercise} ${index}`}
        renderItem={renderItem}
      />
      <TouchableOpacity
        onPress={onPressAddMenu}
        style={{
          borderRadius: 100,
          width: 60,
          height: 60,
          backgroundColor: theme.primary.onColor,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
      >
        <Icon name="plus" fontFamily="AntDesign" fontSize={28} color={theme.primary.color} />
      </TouchableOpacity>
      <Snackbar fontSize={16} ref={snackbarRef} bg="transparent" color="white" p={10} m={0} borderRadius={10} />
    </Div>
  )
}

export default React.memo(WorkoutEditScreen)
