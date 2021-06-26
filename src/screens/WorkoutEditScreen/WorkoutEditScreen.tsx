import { RouteProp, useNavigation } from '@react-navigation/core'
import format from 'date-fns/format'
import React, { FunctionComponent, useLayoutEffect, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Fab, Div, Input, Text, Button, Icon } from 'react-native-magnus'
import { iconFontFamilyType } from 'react-native-magnus/lib/typescript/src/ui/icon/icon.type'
import { WorkoutModel } from '../../data/entities/WorkoutModel'
import { WorkoutParamList } from '../../navigation/navigationTypes'
import { ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import theme, { B } from '../../utils/theme'

type OwnProps = {}

type Props = OwnProps & {
  route: RouteProp<WorkoutParamList, ScreenRoute.WORKOUT_EDIT>
}

export const WorkoutEditScreen: FunctionComponent<Props> = ({
  route: {
    params: { workout },
  },
}) => {
  const navigation = useNavigation()
  const [startDate, setStartDate] = useState(new Date())

  // const onPressEdit = () => {
  //   if (screenMode === Mode.EDIT) {
  //     setScreenMode(Mode.SAVE)
  //   } else {
  //     setScreenMode(Mode.EDIT)
  //   }
  // }
  const onPressSave = () => {
    console.log('yolo')
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onPressSave}>
          <Div mr={20} flexDir="row">
            <Text color={theme.primary.onColor} fontSize={14}>
              SAVE
            </Text>
            <B.Spacer w={8} />

            <B.Spacer w={8} />
            <Icon name="edit" fontFamily="AntDesign" color={theme.primary.onColor} fontSize={18} />
          </Div>
        </TouchableOpacity>
      ),
      headerTitle: () => null,
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
      <Div alignSelf="center" flexDir="row">
        <Text color="white">Date</Text>
        <B.Spacer w={16} />
        <Text color="white">Time</Text>
        <B.Spacer w={16} />
        <Text color="white">Length</Text>
      </Div>

      {/* {screenMode === Mode.SAVE && ( */}
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
      {/* )} */}
    </TouchableWithoutFeedback>
  )
}

export default WorkoutEditScreen
