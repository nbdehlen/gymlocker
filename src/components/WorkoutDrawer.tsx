import React, { FunctionComponent, useState } from 'react'
import { Div, Icon, Text } from 'react-native-magnus'
import { useDatabaseConnection } from '../data/Connection'
import { ExerciseSelectModel } from '../data/entities/ExerciseSelectModel'
import theme from '../utils/theme'
import { useNavigation } from '@react-navigation/core'
import { WorkoutModel } from '../data/entities/WorkoutModel'
import { ScreenRoute } from '../navigation/NAV_CONSTANTS'
import CustomButton, { ButtonEnum } from './CustomButton'

const muscles = [
  {
    title: 'Biceps',
    type: 'biceps',
  },
  {
    title: 'Triceps',
    type: 'triceps',
  },
  {
    title: 'Chest',
    type: 'chest',
  },
]

const WorkoutDrawer: FunctionComponent<{ workout: WorkoutModel }> = ({ workout }) => {
  const { exerciseSelectRepository } = useDatabaseConnection()
  const [exercises, setExercises] = useState<ExerciseSelectModel[]>([])
  const [drawerIndex, setDrawerIndex] = useState(0)
  const navigation = useNavigation()

  const onPressMuscle = async (muscle: string) => {
    console.log({ muscle })
    const exercisesForMuscleGroup = await exerciseSelectRepository.getExercisesByMuscle(muscle)
    if (exercisesForMuscleGroup?.length > 0) {
      setExercises(exercisesForMuscleGroup)
      setDrawerIndex(1)
    }
  }

  const onPressExercise = (exercise: ExerciseSelectModel) => {
    // TODO: global state, useRoute or send as navigation Props?
    // Send to which screen if starting out on add/edit?

    const selectedExercise = {
      assistingMuscles: exercise.assistingMuscles,
      exercise: exercise.exercise,
      muscles: exercise.muscles,
      order: workout?.exercises?.length ?? 0,
      sets: [],
    }

    const newWorkout = {
      ...workout,
      exercises: [...workout?.exercises, selectedExercise],
    }

    navigation.navigate(ScreenRoute.WORKOUT_EDIT, { workout: newWorkout })

    // TODO: Think global state makes sense if I'm gonna have 2 screens (add and edit workout).
    // Also not sure I can "add" to the props becasue the workout is needed for edit screen.

    // TODO: Hide header and simulate back button?
  }

  //TODO: Add animation for back/forth between the drawers
  return (
    <Div bg={theme.primary.color} h="100%">
      {drawerIndex === 0 && (
        <Div>
          <Text fontSize="xl" color={theme.light_1} fontWeight="700" pl="xs">
            EXERCISES
          </Text>
          <CustomButton text="Create new" onPress={() => { }} preset={ButtonEnum.LIST_ITEM} />
          <CustomButton text="Cardio" onPress={() => { }} preset={ButtonEnum.LIST_ITEM} />

          {muscles.map((muscle, i) => (
            <CustomButton
              onPress={() => onPressMuscle(muscle.type)}
              key={i}
              text={muscle.title}
              IconComponent={() => (
                <Icon name="right" fontFamily="AntDesign" fontSize="md" color={theme.light_1} mr={4} />
              )}
              iconSuffix
              preset={ButtonEnum.LIST_ITEM}
              containerProps={{ justifyContent: 'space-between' }}
            />
          ))}
          <CustomButton text="Edit" onPress={() => { }} preset={ButtonEnum.LIST_ITEM} />
          <CustomButton text="Delete" onPress={() => { }} preset={ButtonEnum.LIST_ITEM} />
        </Div>
      )}
      {drawerIndex === 1 && (
        <Div>
          <CustomButton
            text="Back"
            onPress={() => setDrawerIndex(0)}
            IconComponent={() => (
              <Icon name="left" fontFamily="AntDesign" fontSize={16} color={theme.light_border} mr={4} />
            )}
            preset={ButtonEnum.LIST_ITEM}
          />
          {exercises.map((exercise) => (
            <CustomButton
              text={exercise.exercise}
              onPress={() => onPressExercise(exercise)}
              key={exercise.id}
              preset={ButtonEnum.LIST_ITEM}
            />
          ))}
        </Div>
      )}
    </Div>
  )
}

export default React.memo(WorkoutDrawer)
