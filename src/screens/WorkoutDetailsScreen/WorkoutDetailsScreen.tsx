import { RouteProp, useNavigation } from '@react-navigation/core'
import React, { FunctionComponent, useLayoutEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Button, Div, Icon, Text } from 'react-native-magnus'
import WorkoutSummary from '../../components/WorkoutSummary'
import { SetModel } from '../../data/entities/SetModel'
import { WorkoutParamList } from '../../navigation/navigationTypes'
import { DrawerRoute, ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import theme, { B } from '../../utils/theme'
import WorkoutModal from './WorkoutModal'

const ucFirst = (str: string) => {
  if (typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1, str.length)
  }
  return str
}

const truncateSets = (sets: SetModel[]): string => {
  // if all sets are the same, return 12 4x10
  // if weight is the same, return 12x12,8,9,4
  // if any following weight is the same, return 12x12,9 etc
  // 12 4x10, 9
  const uniformSets =
    sets.filter((set) => set.repetitions === sets[0].repetitions && set.weight_kg === sets[0].weight_kg).length ===
    sets.length

  if (uniformSets) {
    const str = `${sets[0].weight_kg}kg ${sets.length}x${sets[0].repetitions}`
    return str
  }

  const unformWeight = sets.filter((set) => set.weight_kg === sets[0].weight_kg).length === sets.length
  if (unformWeight) {
    const weight = `${sets[0].weight_kg}kg `
    let str = `${weight}x`
    sets.map((set, i) => {
      if (sets.length !== i + 1) {
        str += `${set.repetitions}, `
      } else {
        str += set.repetitions
      }
    })
    return str
  }

  let str = ''
  sets.map((set) => {
    str += `${set.weight_kg}x${set.repetitions} `
  })

  return str
}

// TODO: Interesting statistic at the top of each workout (or quote if no stat?)

type OwnProps = {}

type Props = OwnProps & {
  route: RouteProp<WorkoutParamList, ScreenRoute.WORKOUT_DETAILS>
}

export const WorkoutDetailsScreen: FunctionComponent<Props> = ({
  route: {
    params: { workout },
  },
}) => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState<number | null>(null)
  const handleModal = (index: number) => (modalVisible === index ? setModalVisible(null) : setModalVisible(index))

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(DrawerRoute.GYM_DRAWER, { screen: ScreenRoute.WORKOUT_EDIT, params: { workout } })
          }
        >
          <Div mr={20} pb={8} flexDir="row">
            <B.Spacer w={8} />
            <Icon name="edit" fontFamily="AntDesign" color={theme.primary.onColor} fontSize={22} />
          </Div>
        </TouchableOpacity>
      ),
      // TODO: workout date here or do something else with it
      headerTitle: () => (
        <Div alignItems="center" pb={8}>
          <Text color={theme.light_1} fontSize={14}>
            16:32 12th June 21
          </Text>
        </Div>
      ),
    })
  }, [navigation, workout])

  // IDEA: Move DetailsScreen into CalendarScreen?
  // IDEA: Move DetailSScreen to a modal? -> I like this idea
  return (
    <Div flex={1} bg={theme.background} pt={24}>
      <ScrollView>
        {/* <WorkoutSummary workout={workout} /> */}
        <Div mx={16}>
          <Div flexWrap="wrap" alignItems="flex-start">
            {workout?.exercises &&
              workout.exercises.map((exercise, i) => (
                <Div key={exercise.id} ml={0} mb={20} flexDir="row">
                  <Button bg="transparent" p={0} m={0} onPress={() => handleModal(i)}>
                    <Text color={theme.primary.onColor} fontWeight="bold">
                      {exercise.exercise}
                    </Text>
                  </Button>
                  <B.Spacer w={8} />
                  <Text color={theme.light_1}> {truncateSets(exercise.sets)} </Text>
                  <B.Spacer h={16} />
                  <WorkoutModal exercise={exercise} i={i} modalVisible={modalVisible} handleModal={handleModal} />
                </Div>
              ))}
          </Div>
          <Div flexWrap="wrap" alignItems="flex-start">
            {workout?.exercises &&
              workout.cardios.map((cardio) => (
                <Div key={cardio.id} ml={0} mb={20} flexDir="row">
                  <Button bg="transparent" p={0} m={0} /* onPress={() => handleModal(i)} */>
                    <Text color={theme.primary.onColor} fontWeight="bold">
                      {ucFirst(cardio.cardioType)}
                    </Text>
                  </Button>
                  <B.Spacer w={16} />
                  {cardio?.duration_minutes > 0 && (
                    <Div
                      px={8}
                      mb={16}
                      w="20%"
                      borderLeftWidth={1}
                      borderLeftColor={theme.light_border}
                      alignItems="center"
                    >
                      <B.LightText>{cardio.duration_minutes} min</B.LightText>
                    </Div>
                  )}
                  {cardio?.calories > 0 && (
                    <Div
                      px={8}
                      mb={16}
                      w="20%"
                      borderLeftWidth={1}
                      borderLeftColor={theme.light_border}
                      alignItems="center"
                    >
                      <B.LightText>{cardio.calories} kcal</B.LightText>
                    </Div>
                  )}
                  {cardio?.distance_m > 0 && (
                    <Div
                      px={8}
                      mb={16}
                      w="20%"
                      borderLeftWidth={1}
                      borderLeftColor={theme.light_border}
                      alignItems="center"
                    >
                      <B.LightText>{cardio.distance_m / 1000} km</B.LightText>
                    </Div>
                  )}
                  {/* <WorkoutModal cardio={cardio} i={i} modalVisible={modalVisible} handleModal={handleModal} /> */}
                </Div>
              ))}
          </Div>
        </Div>
      </ScrollView>
    </Div>
  )
}

export default WorkoutDetailsScreen
