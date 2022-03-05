import { RouteProp } from '@react-navigation/core'
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Div, Icon } from 'react-native-magnus'
import { WorkoutParamList } from '../../navigation/navigationTypes'
import { ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import theme, { B } from '../../utils/theme'
import WorkoutTime from '../../components/WorkoutTime'
import Collapsible from 'react-native-collapsible'
import SetsTable from '../../components/SetsTable'
import DraggableFlatList, { OpacityDecorator } from 'react-native-draggable-flatlist'
import { ExerciseModel } from '../../data/entities/ExerciseModel'
import InnerDraggable from '../../components/InnerDraggable'
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
  const [expanded, setExpanded] = useState<number[]>([])
  const workoutExercisesLen = workout?.exercises?.length > 0 ? workout.exercises.length : 0
  const exerciseLen = exercises?.length > 0 ? exercises.length : 0

  useEffect(() => {
    // new exercises are added through the drawer and delivered through navigation, inside the workout object.
    // TODO: Similar logic for cardio
    if (workoutExercisesLen > exerciseLen) {
      const lastExercise = workout?.exercises?.[workoutExercisesLen - 1]
      // Ids are created when exercises are added to db. Creating a random one
      // to use as key for keeping track of expanded.
      const newId = Math.floor(Math.random() * 100000000 + 100000)
      const exerciseId = lastExercise?.id ?? newId
      setExpanded((prev) => [...prev, exerciseId])
      const workoutExercises = workout?.exercises.concat()

      if (workoutExercises[workoutExercises.length - 1]?.id == null) {
        workoutExercises[workoutExercises.length - 1].id = newId
      }

      setExercises(workoutExercises)
    }
  }, [workout, workoutExercisesLen, exerciseLen])

  const toggleExpand = useCallback(
    (i: number) => {
      if (expanded.includes(i)) {
        const newExpanded = [
          ...expanded.slice(0, expanded.indexOf(i)),
          ...expanded.slice(expanded.indexOf(i) + 1, expanded.length),
        ]
        setExpanded(newExpanded)
      } else {
        setExpanded((prev) => [...prev, i])
      }
    },
    [expanded]
  )

  const addSet = useCallback(
    (exercise: ExerciseModel, exerciseIndex: number) => {
      const newSet = {
        id: 88888888888,
        weight_kg: 300,
        repetitions: 99,
        order: 10,
        exercise_id: exercise.id || 0,
        exercise,
      }
      const modifiedExercise: ExerciseModel | ICreateExerciseData = exercise
      if (modifiedExercise.sets?.length > 0) {
        modifiedExercise.sets.push(newSet)
      } else {
        modifiedExercise.sets = [newSet]
      }

      if (exercises?.length > 0) {
        setExercises((prev) => [
          ...prev.slice(0, exerciseIndex),
          modifiedExercise,
          ...prev.slice(exerciseIndex + 1, prev?.length),
        ])
      }
    },
    [exercises?.length]
  )

  const renderItem = (props): any => {
    const { item, drag, isActive, index } = props
    return (
      <OpacityDecorator>
        <TouchableOpacity
          onLongPress={drag}
          onPress={() => toggleExpand(item.id)}
          disabled={isActive}
          style={{ backgroundColor: theme.background }}
        >
          <Div flex={1} flexDir="row">
            <B.LightText fontWeight="bold" fontSize={14}>
              {item.exercise}
            </B.LightText>
            <B.Spacer w={8} />
            <Icon
              name={expanded.includes(item.id) ? 'up' : 'down'}
              fontFamily="AntDesign"
              fontSize={14}
              color={theme.light_1}
              mr={12}
            />
          </Div>
        </TouchableOpacity>

        {/* https://github.com/oblador/react-native-collapsible/issues/420 */}
        {/* TODO: Calculate height or try magnus/different collapisble.
        Animation not seen now due to the constant re-rendering  */}
        <Collapsible collapsed={!expanded.includes(item.id)} key={Math.random()}>
          <B.Spacer h={16} />
          {/* <InnerDraggable sets={item.sets} /> */}
          <SetsTable sets={item?.sets} headers={['WEIGHT', 'REPS', 'EDIT']} />
          <Div flexDir="row" justifyContent="center">
            <CustomButton
              text="Add set"
              onPress={() => addSet(item, index)}
              preset={ButtonEnum.PRIMARY}
              IconComponent={() => (
                <Icon fontSize="xl" fontFamily="AntDesign" name="plus" ml="sm" color={theme.primary.onColor} />
              )}
              iconSuffix
            />
          </Div>
        </Collapsible>
        <B.Spacer h={16} />
      </OpacityDecorator>
    )
  }

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
