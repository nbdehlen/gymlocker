import { RouteProp, useNavigation } from '@react-navigation/core'
import React, { FunctionComponent, useLayoutEffect } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Button, Div, Icon, Text } from 'react-native-magnus'
import WorkoutSection from '../../components/WorkoutSection'
import { ExerciseModel } from '../../data/entities/ExerciseModel'
import { SetModel } from '../../data/entities/SetModel'
import { WorkoutModel } from '../../data/entities/WorkoutModel'
import { WorkoutParamList } from '../../navigation/navigationTypes'
import { ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import theme, { B } from '../../utils/theme'

// type GeneralRowProps = {
//   title: string
//   data: string
// }

// const GeneralRow: FunctionComponent<GeneralRowProps> = ({ title, data }) => (
//   <Div flexDir="row">
//     <Text color={theme.light_1}>{`${title}: `}</Text>
//     <Text color={theme.light_1}>{data}</Text>
//   </Div>
// )

// type ExerciseHeaderProps = {
//   title: string
//   exercise: ExerciseModel
//   Modal: JSX.Element

// }

// const ExerciseHeader: FunctionComponent<ExerciseHeaderProps> = ({ title, exercise, Modal }) => {
//   return (
//     <Div>
//       <Text>{title}</Text>
//       <Button>
//         <Text>Details...</Text>
//       </Button>
//     </Div>
//   )
// }

const truncateSets = (sets: SetModel[]): string => {
  // if all sets are the same, return 12 4x10
  // if weight is the same, return 12x12,8,9,4
  // if any following weight is the same, return 12x12,9 etc
  // 12 4x10, 9
  const uniformSets =
    sets.filter(
      (set) => set.repetitions === sets[0].repetitions && set.weight_kg === sets[0].weight_kg
    ).length === sets.length

  if (uniformSets) {
    const str = `${sets[0].weight_kg}kg ${sets.length}x${sets[0].repetitions}`
    return str
  }

  const unformWeight =
    sets.filter((set) => set.weight_kg === sets[0].weight_kg).length === sets.length
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

type ExerciseTableProps = {
  sets: SetModel[]
  headers?: string[]
}
const SetsTable: FunctionComponent<ExerciseTableProps> = ({ sets, headers }) => (
  <Div
  // flexDir="row"
  >
    <Div flexDir="row" flex={1}>
      <Div flex={1}></Div>
      {headers &&
        headers.map((header) => (
          <Div alignItems="center" flex={1}>
            <Text fontSize={13} color={theme.light_1}>
              {header}
            </Text>
          </Div>
        ))}
    </Div>
    {sets.map((set, i) => {
      return (
        <>
          <Div
            // borderBottomWidth={1}
            // borderColor={theme.placeholder_opacity} //weaker blue
            // alignItems="flex-end"
            // flex={1}
            flexDir="row">
            <Div flex={1}>
              <Text
                style={{
                  fontSize: 13,
                  color: theme.light_1,
                }}>
                SET {i + 1}
              </Text>
            </Div>
            <Div style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 14, color: theme.light_1 }}>{`${set.weight_kg} kg`}</Text>
            </Div>
            <Div style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 14, color: theme.light_1 }}>{set.repetitions}</Text>
            </Div>
          </Div>
          <B.Spacer h={4} />
        </>
      )
    })}
  </Div>
)

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
  // console.log(workout.exercises[0].sets, 'SSSSSSSSSSSSEEEEEEEEEEETTTTTTTTTTTSSSSSSS')

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate(ScreenRoute.WORKOUT_EDIT, { workout })}>
          <Div mr={20} pb={8} flexDir="row">
            <B.Spacer w={8} />
            <Icon name="edit" fontFamily="AntDesign" color={theme.primary.onColor} fontSize={22} />
          </Div>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <Div alignItems="center" pb={8}>
          <Text color={theme.light_1} fontSize={14}>
            16:32 12th June 21
          </Text>
        </Div>
      ),
    })
  }, [navigation])

  // TODO: Fix padding for this and WorkoutSection
  return (
    <Div flex={1} bg={theme.background} pt={24}>
      <ScrollView>
        <WorkoutSection workout={workout} />
        <Div mx={16}>
          <Div flexWrap="wrap" alignItems="flex-start">
            {workout?.exercises &&
              workout.exercises.map((exercise) => (
                <Div key={exercise.id} ml={0} mb={20} flexDir="row">
                  <Button bg="transparent" p={0} m={0}>
                    <Text color={theme.primary.onColor} fontWeight="bold">
                      {exercise.exercise}
                    </Text>
                  </Button>
                  {/* <SetsTable sets={exercise.sets} headers={['WEIGHT', 'REPS']} /> */}

                  {/* <Div flexDir="row"> */}
                  <B.Spacer w={8} />
                  <Text color={theme.light_1}> {truncateSets(exercise.sets)} </Text>
                  {/* {exercise.sets.map((set) => (
                    <Div flexDir="row" justifyContent="flex-start">
                    <Div flexDir="row"> */}
                  {/* <Text color={theme.light_1}>{`${set.weight_kg}`}</Text>
                      <Text color={theme.light_1}>{`x${set.repetitions} `}</Text> */}
                  {/* </Div> */}

                  {/* ))} */}
                  <B.Spacer h={16} />
                </Div>
              ))}
          </Div>
        </Div>
      </ScrollView>
    </Div>
  )
}

export default WorkoutDetailsScreen