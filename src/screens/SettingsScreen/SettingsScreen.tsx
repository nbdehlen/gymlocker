import React, { FunctionComponent, useState } from 'react'
import { useDatabaseConnection } from '../../data/Connection'
import { Button, Div, Input, Text } from 'react-native-magnus'
import sampleData from '../../data/seeding/sampleData'
import theme, { B } from '../../utils/theme'

type OwnProps = {}

type Props = OwnProps

export const SettingsScreen: FunctionComponent<Props> = () => {
  const { cardioRepository, workoutRepository, exerciseRepository, setRepository } =
    useDatabaseConnection()
  const [workoutId, setWorkoutId] = useState(1)

  const { cardios, exercises, sets, workouts } = sampleData

  const seedWorkouts = async () => {
    const data = await workoutRepository.createMany(workouts)
    console.log(data)
  }
  const seedExercises = async () => {
    const data = await exerciseRepository.createMany(exercises)
    console.log(data)
  }

  const seedSets = async () => {
    const data = await setRepository.createMany(sets)
    console.log(data)
  }

  const onPressInc = () => {
    setWorkoutId((prevState) => prevState + 1)
  }
  const onPressDec = () => {
    setWorkoutId((prevState) => prevState - 1)
  }

  return (
    <Div flex={1} justifyContent="center" alignItems="center" bg={theme.primary.color}>
      <Div flexDir="row">
        <Button
          onPress={onPressInc}
          w={40}
          h={40}
          p={0}
          m={0}
          bg={theme.primary.onColor}
          rounded="circle">
          <Text color="white" fontSize={34}>
            +
          </Text>
        </Button>
        <B.Spacer w={8} />
        <Text color="white" fontSize={24}>
          {workoutId}
        </Text>
        <B.Spacer w={8} />
        <Button onPress={onPressDec} w={40} h={40} p={0} m={0} rounded="circle">
          <Text color="white" fontSize={50}>
            -
          </Text>
        </Button>
      </Div>
      <B.Spacer h={16} />
      <Button onPress={seedWorkouts} alignSelf="center" w={200}>
        <Text color="white">Seed DB with {workoutId} workouts </Text>
      </Button>

      <B.Spacer h={16} />
      <Button onPress={seedExercises} alignSelf="center">
        <Text color="white">Seed workout {workoutId} with exercises </Text>
      </Button>

      <B.Spacer h={16} />
      <Button onPress={seedSets} alignSelf="center">
        <Text color="white">Seed exercises in workout {workoutId} with sets </Text>
      </Button>
    </Div>
  )
}

export default SettingsScreen
