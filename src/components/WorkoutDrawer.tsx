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
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

const WorkoutDrawer: FunctionComponent<{ workout: WorkoutModel }> = ({ workout }) => {
  const { exerciseSelectRepository, muscleRepository } = useDatabaseConnection()
  const [drawerExercises, setDrawerExercises] = useState<ExerciseSelectModel[]>([])
  const [drawerIndex, setDrawerIndex] = useState(0)
  const navigation = useNavigation()

  const onPressMuscle = async (name: string) => {
    const muscle = await muscleRepository.getByName(name)

    if (muscle instanceof MuscleModel) {
      const exercisesForMuscleGroup = await exerciseSelectRepository.getExercisesByMuscleId(muscle.id, [
        'modifiersAvailable',
        'modifiersAvailable.modifier',
      ])

      if (exercisesForMuscleGroup?.length > 0) {
        setDrawerExercises(exercisesForMuscleGroup)
        setDrawerIndex(1)
      }
    }
  }
  const onPressDrawerExercise = (exercise: ExerciseSelectModel) => {
    // Adding an exercise to the workout from drawer
    const selectedExercise: ExerciseModel = {
      id: uuidv4(),
      exercise: exercise.exercise,
      order: workout?.exercises?.length ?? 0,
      sets: [],
      modifiers: [],
      workout_id: workout.id,
      exerciseSelectId: exercise.id,
      exerciseSelect: exercise,
    }

    const newWorkout = {
      ...workout,
      exercises: workout.exercises ? [...workout.exercises, selectedExercise] : [selectedExercise],
    }

    setDrawerIndex(0)
    navigation.navigate(ScreenRoute.WORKOUT_EDIT, { workout: newWorkout, type: 'add_exercise' })
  }

  // TODO: Hide header and simulate back button?
  // TODO: Add animation for back/forth between the drawers
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
          {drawerExercises.map((drawerExercise) => (
            <CustomButton
              text={drawerExercise.exercise}
              onPress={() => onPressDrawerExercise(drawerExercise)}
              key={drawerExercise.id}
              preset={ButtonEnum.LIST_ITEM}
            />
          ))}
        </Div>
      )}
    </ScrollDiv>
  )
}

export default React.memo(WorkoutDrawer)
