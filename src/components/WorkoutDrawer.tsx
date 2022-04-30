import React, { FunctionComponent, useState } from 'react'
import { Div, Icon, ScrollDiv, Text } from 'react-native-magnus'
import { useDatabaseConnection } from '../data/Connection'
import { ExerciseSelectModel } from '../data/entities/ExerciseSelectModel'
import theme from '../utils/theme'
import { useNavigation } from '@react-navigation/core'
import { WorkoutModel } from '../data/entities/WorkoutModel'
import { ScreenRoute } from '../navigation/NAV_CONSTANTS'
import CustomButton, { ButtonEnum } from './CustomButton'
import muscles from '../data/seeding/starter/muscles/muscles.json'
import { ucFirst } from '../helpers/general'
import { MuscleModel } from '../data/entities/MuscleModel'
import { ExerciseModel } from '../data/entities/ExerciseModel'

const WorkoutDrawer: FunctionComponent<{ workout: WorkoutModel }> = ({ workout }) => {
  const { exerciseSelectRepository, muscleRepository } = useDatabaseConnection()
  const [exercises, setExercises] = useState<ExerciseSelectModel[]>([])
  const [drawerIndex, setDrawerIndex] = useState(0)
  const navigation = useNavigation()

  const onPressMuscle = async (name: string) => {
    const muscle = await muscleRepository.getByName(name)

    if (muscle instanceof MuscleModel) {
      const exercisesForMuscleGroup = await exerciseSelectRepository.getExercisesByMuscleId(muscle.id, [
        'muscles',
        'modifiersAvailable',
        'modifiersAvailable.modifier',
      ])

      if (exercisesForMuscleGroup?.length > 0) {
        setExercises(exercisesForMuscleGroup)
        setDrawerIndex(1)
      }
    }
  }

  const onPressExercise = (exercise: Partial<ExerciseModel> | ExerciseSelectModel) => {
    // TODO: global state, useRoute or send as navigation Props?
    // Send to which screen if starting out on add/edit?

    const selectedExercise = {
      exercise: exercise.exercise,
      muscles: exercise.muscles.muscle,
      assistingMuscles: exercise.assistingMuscles,
      modifiersAvailable: exercise.modifiersAvailable,
      modifiers: exercise.modifiers,
      order: workout?.exercises?.length ?? 0,
      sets: [],
    }
    // TODO: Modifiers AND modifiersAvailable on EditWorkoutScreen
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
    <ScrollDiv bg={theme.primary.color} h="100%">
      {drawerIndex === 0 && (
        <Div>
          <Text fontSize="xl" color={theme.light_1} fontWeight="700" pl="xs">
            EXERCISES
          </Text>
          <CustomButton text="Create new" onPress={() => { }} preset={ButtonEnum.LIST_ITEM} />
          <CustomButton text="Cardio" onPress={() => { }} preset={ButtonEnum.LIST_ITEM} />

          {/* TODO: Memoize this */}
          {muscles.muscles.map((muscle, i) => (
            <CustomButton
              onPress={() => onPressMuscle(muscle.muscle)}
              key={i}
              text={ucFirst(muscle.muscle)}
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
    </ScrollDiv>
  )
}

export default React.memo(WorkoutDrawer)
