import { useNavigation } from '@react-navigation/core'
import format from 'date-fns/format'
import React, { FunctionComponent, useLayoutEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Fab, Div, Input, Text, Button, Icon } from 'react-native-magnus'
import theme from '../../utils/theme'

type OwnProps = {}

type Props = OwnProps

export const WorkoutAddScreen: FunctionComponent<Props> = () => {
  const navigation = useNavigation()
  const [startDate, setStartDate] = useState(new Date())

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Div>
          <Text color="green" fontSize={16}>
            Save
          </Text>
        </Div>
      ),
      headerTitle: () => (
        <Div justifyContent="center" alignItems="center">
          <Text color="yellow" fontSize={16}>
            Clear
          </Text>
        </Div>
      ),
    })
  }, [navigation])

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      containerStyle={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: theme.primary.color,
        justifyContent: 'center',
        width: '100%',
      }}
      style={{ width: '100%' }}>
      <Div alignSelf="center">
        <Text color="white">Date</Text>
        <Text color="white">Time</Text>
        <Text color="white">Length</Text>
      </Div>
      <Fab bg="blue600" h={58} w={58} position="absolute" flex={1} bottom={20} right={20}>
        <Button p="none" bg="transparent" justifyContent="flex-end">
          <Div rounded="sm" bg="white" p="sm">
            <Text fontSize="md">Add exercise</Text>
          </Div>
        </Button>
        <Button p="none" bg="transparent" justifyContent="flex-end">
          <Div rounded="sm" bg="white" p="sm">
            <Text fontSize="md">Add cardio</Text>
          </Div>
        </Button>
      </Fab>
    </TouchableWithoutFeedback>
  )
}

export default WorkoutAddScreen
