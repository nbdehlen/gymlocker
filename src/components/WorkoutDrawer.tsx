import React, { FunctionComponent, useState } from 'react'
import { Div, Icon, Text } from 'react-native-magnus'
import { useDatabaseConnection } from '../data/Connection'
import { ExerciseSelectModel } from '../data/entities/ExerciseSelectModel'
import theme from '../utils/theme'
import ListItem from '../components/ListItem'
import { useNavigation } from '@react-navigation/core'
import { WorkoutModel } from '../data/entities/WorkoutModel'
import { ScreenRoute } from '../navigation/NAV_CONSTANTS'

const muscles = [
  {
    title: 'Biceps',
    type: 'biceps'
  },
  {
    title: 'Triceps',
    type: 'triceps'
  },
  {
    title: 'Chest',
    type: 'chest'
  }
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
      sets: []
    }

    const newWorkout = {
      ...workout,
      exercises: [...workout?.exercises, selectedExercise]
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
          <Text fontSize={16} color={theme.light_1} fontWeight="700" py={4} pl={2}>
            EXERCISES
          </Text>
          <ListItem title="Create new" onPress={() => { }} />
          <ListItem title="Cardio" onPress={() => { }} />

          {muscles.map((muscle, i) => (
            <ListItem
              onPress={() => onPressMuscle(muscle.type)}
              key={i}
              title={muscle.title}
              ListIcon={() => <Icon name="right" fontFamily="AntDesign" fontSize={16} color={theme.light_1} />}
              iconSuffix
              containerProps={{ justifyContent: 'space-between' }}
            />
          ))}
          <ListItem title="Edit" onPress={() => { }} />
          <ListItem title="Delete" onPress={() => { }} />
        </Div>
      )}
      {drawerIndex === 1 && (
        <Div>
          <ListItem
            title="Back"
            onPress={() => setDrawerIndex(0)}
            ListIcon={() => <Icon name="left" fontFamily="AntDesign" fontSize={16} color={theme.light_border} />}
            textProps={{ fontSize: 16 }}
          />
          {exercises.map((exercise) => (
            <ListItem title={exercise.exercise} onPress={() => onPressExercise(exercise)} key={exercise.id} />
          ))}
        </Div>
      )}
    </Div>
  )
}

export default WorkoutDrawer
