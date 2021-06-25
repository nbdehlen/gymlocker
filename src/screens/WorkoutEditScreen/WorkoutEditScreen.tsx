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

enum Mode {
  EDIT = 'EDIT',
  SAVE = 'SAVE',
}

type ModeData = {
  text: string
  iconName: string
  fontFamily: iconFontFamilyType
}

type ModeMap = {
  [key: string]: ModeData
}

const modeMap: ModeMap = {
  EDIT: {
    text: 'EDIT',
    iconName: 'edit',
    fontFamily: 'AntDesign',
  },
  SAVE: {
    text: 'SAVE',
    iconName: 'ios-save-outline',
    fontFamily: 'Ionicons',
  },
}

// type ScreenMode = 'EDIT' | 'SAVE'

type OwnProps = {}

type Props = OwnProps & {
  route: RouteProp<WorkoutParamList, ScreenRoute.WORKOUT_EDIT>
}

export const WorkoutEditScreen: FunctionComponent<Props> = ({
  route: {
    params: { workout },
  },
}) => {
  // console.log('IN WORKOUT EDIT SCREEN: ', { workout })
  const [screenMode, setScreenMode] = useState<Mode>(Mode.SAVE)
  const navigation = useNavigation()
  const [startDate, setStartDate] = useState(new Date())

  const onPressEdit = () => {
    if (screenMode === Mode.EDIT) {
      setScreenMode(Mode.SAVE)
    } else {
      setScreenMode(Mode.EDIT)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onPressEdit}>
          <Div mr={20} flexDir="row">
            <Text color={theme.primary.onColor} fontSize={14}>
              {modeMap[screenMode].text}
            </Text>
            <B.Spacer w={8} />

            <B.Spacer w={8} />
            <Icon
              name={modeMap[screenMode].iconName}
              fontFamily={modeMap[screenMode].fontFamily}
              color={theme.primary.onColor}
              fontSize={18}
            />
          </Div>
        </TouchableOpacity>
      ),
      headerTitle: () => null,
    })
  }, [navigation, screenMode])

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

      {screenMode === Mode.SAVE && (
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
      )}
    </TouchableWithoutFeedback>
  )
}

export default WorkoutEditScreen
