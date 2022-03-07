import { RouteProp } from '@react-navigation/core'
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { Collapse, Div, Icon } from 'react-native-magnus'
import { WorkoutParamList } from '../../navigation/navigationTypes'
import { ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import theme, { B } from '../../utils/theme'
import WorkoutTime from '../../components/WorkoutTime'
import SetsTable from '../../components/SetsTable'
import DraggableFlatList, { OpacityDecorator, RenderItemParams } from 'react-native-draggable-flatlist'
import { ExerciseModel } from '../../data/entities/ExerciseModel'
import CustomButton, { ButtonEnum } from '../../components/CustomButton'
import { ICreateExerciseData } from '../../data/repositories/ExerciseRepository'

type OwnProps = {}

type Props = OwnProps & {
  route: RouteProp<WorkoutParamList, ScreenRoute.WORKOUT_EDIT>
}

// IDEA: onSwipeLeft/right - delete button, undo?  different for if in edit mode?
export const WorkoutEditScreen: FunctionComponent<Props> = ({ route }) => {
  // TODO: Custom exerciseSelect add
  // TODO: Add cardio functionality
  // TODO: connect every order update set, exercise and cardio to something
  // TODO: Update, delete set and exercise

  const { workout } = route.params
  const dateRef = useRef({
    startDate: workout.start,
    endDate: new Date(workout.start.getTime() + 60 * 60 * 1000),
  })
  const [exercises, setExercises] = useState<(ExerciseModel | ICreateExerciseData)[]>(workout?.exercises || [])
  const workoutExercisesLen = workout?.exercises?.length > 0 ? workout.exercises.length : 0
  const exerciseLen = exercises?.length > 0 ? exercises.length : 0

  useEffect(() => {
    // new exercises are added through the drawer and delivered through navigation, inside the workout object.
    // TODO: Similar logic for cardio
    if (workoutExercisesLen > exerciseLen) {
      // Ids are created when exercises are added to db. Creating a random one
      // to use as key for keeping track of expanded.
      const newId = Math.floor(Math.random() * 100000000 + 100000)
      const workoutExercises = workout?.exercises.concat()

      if (workoutExercises[workoutExercises.length - 1]?.id == null) {
        workoutExercises[workoutExercises.length - 1].id = newId
      }

      setExercises(workoutExercises)
    }
  }, [workout, workoutExercisesLen, exerciseLen])

  const addSet = useCallback(
    (exercise: ExerciseModel | ICreateExerciseData, exerciseIndex: number) => {
      const newSet = {
        id: 88888888888,
        weight_kg: 300,
        repetitions: 99,
        order: 10,
        exercise_id: exercise.id || 0,
        exercise,
      }
      const exerciseCopy: ExerciseModel | ICreateExerciseData = exercise
      if (exerciseCopy.sets && exerciseCopy.sets?.length > 0) {
        exerciseCopy.sets.push(newSet)
      } else {
        exerciseCopy.sets = [newSet]
      }

      if (exercises?.length > 0) {
        setExercises((prev) => [
          ...prev.slice(0, exerciseIndex),
          exerciseCopy,
          ...prev.slice(exerciseIndex + 1, prev?.length),
        ])
      }
    },
    [exercises]
  )

  const renderItem = useCallback(
    ({ item, drag, isActive, index }: RenderItemParams<ExerciseModel | ICreateExerciseData>) => {
      const onPressAddSet = () => index != null && addSet(item, index)
      const IconUp = () => <Icon name="up" fontFamily="AntDesign" fontSize="sm" color={theme.light_1} mr="xl" />
      const IconDown = () => <Icon name="down" fontFamily="AntDesign" fontSize="sm" color={theme.light_1} mr="xl" />

      return (
        <OpacityDecorator>
          <Collapse bg="transparent">
            <Collapse.Header
              bg="transparent"
              px="none"
              py="none"
              m="none"
              prefix={null}
              suffix={<IconDown />}
              activeSuffix={<IconUp />}
              onLongPress={drag}
              disabled={isActive}
              flexDir="row"
              justifyContent="space-between"
            >
              <B.LightText fontWeight="bold" fontSize={14}>
                {item.exercise}
              </B.LightText>
              <B.Spacer w={8} />
            </Collapse.Header>
            <Collapse.Body pt={32} mt={0} pb={0}>
              {item?.sets && <SetsTable sets={item.sets} headers={['WEIGHT', 'REPS', 'EDIT']} />}
              <Div py="md" />
              <Div flexDir="row" justifyContent="center">
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
          <Div py="lg" />
        </OpacityDecorator>
      )
    },
    [addSet]
  )

  return (
    <DraggableFlatList
      containerStyle={{ flex: 1, backgroundColor: theme.primary.color, paddingLeft: 16 }}
      ListHeaderComponentStyle={{ marginBottom: 20 }}
      ListHeaderComponent={<WorkoutTime forwardedRef={dateRef} />}
      data={exercises ?? []}
      onDragEnd={({ data }) => setExercises(data)}
      keyExtractor={(item, index) => `${item.id ?? ''} ${index}`}
      renderItem={renderItem}
    />
  )
}

export default WorkoutEditScreen
