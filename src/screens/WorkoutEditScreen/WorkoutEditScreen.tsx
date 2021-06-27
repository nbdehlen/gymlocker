import { RouteProp, useNavigation } from '@react-navigation/core'
import format from 'date-fns/format'
import React, { FunctionComponent, useLayoutEffect, useState } from 'react'
import { Keyboard, Platform, ScrollView, TouchableOpacity } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Fab, Div, Input, Text, Button, Icon, ThemeContext } from 'react-native-magnus'
import { iconFontFamilyType } from 'react-native-magnus/lib/typescript/src/ui/icon/icon.type'
import { WorkoutModel } from '../../data/entities/WorkoutModel'
import { WorkoutParamList } from '../../navigation/navigationTypes'
import { ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import theme, { B } from '../../utils/theme'
import DateTimePicker from '@react-native-community/datetimepicker'
import { getThemeColor } from 'react-native-magnus/lib/typescript/src/theme/theme.service'
import SetsTable from '../../components/SetsTable'

type OwnProps = {}

type Props = OwnProps & {
  route: RouteProp<WorkoutParamList, ScreenRoute.WORKOUT_EDIT>
}

// TODO: OnLongPress -> re-arrange order?
export const WorkoutEditScreen: FunctionComponent<Props> = ({
  route: {
    params: { workout },
  },
}) => {
  const navigation = useNavigation()
  // Date stuff
  const [date, setDate] = useState(workout.start)
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)

  // const onPressEdit = () => {
  //   if (screenMode === Mode.EDIT) {
  //     setScreenMode(Mode.SAVE)
  //   } else {
  //     setScreenMode(Mode.EDIT)
  //   }
  // }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onPressSave}>
          <Div mr={20} flexDir="row">
            <Text color={theme.primary.onColor} fontSize={14}>
              SAVE
            </Text>
            <B.Spacer w={8} />
            <Icon
              name="ios-save-outline"
              fontFamily="Ionicons"
              color={theme.primary.onColor}
              fontSize={18}
            />
          </Div>
        </TouchableOpacity>
      ),
      headerTitle: () => null,
    })
  }, [navigation])

  const onPressSave = () => {
    console.log('yolo')
  }

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
  }

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    showMode('date')
  }

  const showTimepicker = () => {
    showMode('time')
  }

  return (
    // <Div flex={1}>
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      containerStyle={{
        flex: 1,
        backgroundColor: theme.primary.color,
        // justifyContent: 'flex-start',
      }}>
      <ScrollView
        contentContainerStyle={{
          minHeight: '100%',
          // justifyContent: 'flex-start',
          // justifyContent: 'space-evenly',
          // justifyContent: 'flex-start',
          // alignItems: 'flex-end',
        }}
        // style={{ backgroundColor: 'grey' }}
      >
        <Div justifyContent="center" flexDir="row">
          <B.LightText fontWeight="bold" fontSize={14}>
            WORKOUT INFO
          </B.LightText>
        </Div>

        <Div flexDir="row" mx={20} mt={20}>
          <Div flex={1} alignItems="center">
            <TouchableWithoutFeedback onPress={showDatepicker}>
              <B.LightText fontSize={12}>Start date</B.LightText>
              <B.LightText
                fontSize={16}
                rounded={4}
                px={6}
                py={2}
                borderWidth={1}
                borderColor={theme.primary.border}
                // borderColor={theme.placeholder_opacity}
              >
                {format(date, 'dd MMM yy')}
              </B.LightText>
            </TouchableWithoutFeedback>
          </Div>

          <Div flex={1} alignItems="center">
            <TouchableWithoutFeedback onPress={showTimepicker}>
              <B.LightText fontSize={12}>Start time</B.LightText>
              <B.LightText
                fontSize={16}
                borderWidth={1}
                // borderColor={theme.placeholder_opacity}
                borderColor={theme.primary.border}
                rounded={4}
                px={6}
                py={2}>
                {format(date, 'HH:mm')}
              </B.LightText>
            </TouchableWithoutFeedback>
          </Div>

          <Div flex={1} alignItems="center">
            <TouchableWithoutFeedback>
              <B.LightText fontSize={12}>Minutes</B.LightText>
              <B.LightText
                fontSize={16}
                borderWidth={1}
                // borderColor={theme.placeholder_opacity}
                borderColor={theme.primary.border}
                rounded={4}
                px={6}
                py={2}>
                123
              </B.LightText>
            </TouchableWithoutFeedback>
          </Div>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          )}
        </Div>

        <B.Spacer h={20} />
        {workout.exercises.map((exercise) => (
          <Div>
            {/* <SetsTable sets={exercise.sets} headers={['WEIGHT', 'REPS', '']} /> */}
            <Div flexDir="row">
              <Div flex={1}>
                <B.LightText fontWeight="bold" fontSize={14}>
                  {exercise.exercise}
                </B.LightText>
              </Div>
              <Icon
                name="edit"
                fontFamily="FontAwesome"
                fontSize={16}
                color={theme.primary.onColor}
                mr={12}
              />
            </Div>
            <Div flexDir="row"></Div>
            <B.Spacer h={16} />
          </Div>
        ))}
      </ScrollView>
      <Fab
        bg={theme.primary.color}
        color={theme.primary.onColor}
        h={50}
        p={0}
        borderWidth={1}
        borderColor={theme.primary.onColor}
        w={50}
        position="absolute"
        // flex={1}
        bottom={20}
        right={20}>
        <Button
          p="none"
          bg="transparent"
          justifyContent="flex-end"
          borderColor={theme.primary.onColor}
          borderWidth={1}>
          <Div rounded="sm" bg={theme.background} p="sm">
            <Text color={theme.primary.onColor}>Add exercise</Text>
          </Div>
        </Button>
        <Button
          p="none"
          bg="transparent"
          justifyContent="flex-end"
          borderColor={theme.primary.onColor}
          borderWidth={1}>
          <Div rounded="sm" bg="white" p="sm">
            <Text color={theme.primary.onColor} fontSize="md">
              Add cardio
            </Text>
          </Div>
        </Button>
      </Fab>
    </TouchableWithoutFeedback>
    // </Div>
  )
}

export default WorkoutEditScreen
