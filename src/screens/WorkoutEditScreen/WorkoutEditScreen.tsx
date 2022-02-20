import { RouteProp } from '@react-navigation/core'
import format from 'date-fns/format'
import React, { FunctionComponent, useState } from 'react'
import { Keyboard, Platform, ScrollView } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Div, Input, Icon } from 'react-native-magnus'
import { WorkoutParamList } from '../../navigation/navigationTypes'
import { ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import theme, { B } from '../../utils/theme'
import DateTimePicker from '@react-native-community/datetimepicker'

type OwnProps = {}

type Props = OwnProps & {
  route: RouteProp<WorkoutParamList, ScreenRoute.WORKOUT_EDIT>
}

// TODO: OnLongPress -> re-arrange order?
export const WorkoutEditScreen: FunctionComponent<Props> = ({ route }) => {
  const { workout } = route.params

  // TODO: create hook for the date stuff?
  // Date stuff
  const [date, setDate] = useState(workout.start)
  const [endDate, setEndDate] = useState(new Date(workout.start.getTime() + 60 * 60 * 1000))
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [pickerIndex, setPickerIndex] = useState(0)
  const minutes = (endDate.getTime() - date.getTime()) / (60 * 1000)
  const [min, setMin] = useState(minutes)

  const onChangeMinutes = (minStr: string) => {
    setMin(Number(minStr))
  }

  const onBlurMinutes = () => {
    const dateAsNum = date.getTime() + min * 60 * 1000
    const newEndDate = new Date(dateAsNum)

    // TODO: need to use blur/focus and/or debounce it
    setEndDate(newEndDate)
  }

  // TODO: determine if edited for save button and/or alert
  const [touched, setTouched] = useState(false)

  const [activeExercise, setActiveExercise] = useState<number>()
  const changeActiveExercise = (num: number) => setActiveExercise(num)

  const onChangeDate = (event, selectedDate) => {
    const newDate = pickerIndex === 0 ? date : endDate
    const currentDate = selectedDate || newDate
    setShow(Platform.OS === 'ios')
    pickerIndex === 0 ? setDate(currentDate) : setEndDate(currentDate)
    // TODO: also need to set minutes here
  }

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    showMode('date')
  }

  const showTimepicker = (picker: number) => {
    setPickerIndex(picker)
    showMode('time')
  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      containerStyle={{ flex: 1, backgroundColor: theme.primary.color }}
    >
      <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
        <Div flexDir="row" mx={20} mt={20}>
          <Div flex={1} alignItems="center">
            <TouchableWithoutFeedback onPress={showDatepicker}>
              <B.LightText fontSize={12}>Start date</B.LightText>
              <B.LightText fontSize={16} rounded={4} px={6} py={2} borderWidth={1} borderColor={theme.primary.border}>
                {format(date, 'dd MMM yy')}
              </B.LightText>
            </TouchableWithoutFeedback>
          </Div>

          <Div flex={1} alignItems="center">
            <TouchableWithoutFeedback onPress={() => showTimepicker(0)}>
              <B.LightText fontSize={12}>Start time</B.LightText>
              <B.LightText fontSize={16} borderWidth={1} borderColor={theme.primary.border} rounded={4} px={6} py={2}>
                {format(date, 'HH:mm')}
              </B.LightText>
            </TouchableWithoutFeedback>
          </Div>

          <Div flex={1} alignItems="center">
            <TouchableWithoutFeedback onPress={() => showTimepicker(1)}>
              <B.LightText fontSize={12}>End time</B.LightText>
              <B.LightText fontSize={16} borderWidth={1} borderColor={theme.primary.border} rounded={4} px={6} py={2}>
                {format(endDate, 'HH:mm')}
              </B.LightText>
            </TouchableWithoutFeedback>
          </Div>

          <Div flex={1} alignItems="center">
            <TouchableWithoutFeedback>
              <B.LightText fontSize={12}>Minutes</B.LightText>
              <Input
                bg="transparent"
                fontSize={16}
                borderWidth={1}
                borderColor={theme.primary.border}
                color={theme.light_1}
                rounded={4}
                px={6}
                py={0}
                focusBorderColor="blue700"
                keyboardType="numeric"
                onChangeText={onChangeMinutes}
                value={min === 0 ? '' : String(min)}
                onBlur={onBlurMinutes}
              />
            </TouchableWithoutFeedback>
          </Div>
          {show && (
            <DateTimePicker
              value={pickerIndex === 0 ? date : endDate}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          )}
        </Div>
        <B.Spacer h={20} />
        {workout.exercises.map((exercise, i) => (
          <Div key={i}>
            <Div flexDir="row">
              <Div flex={1}>
                <B.LightText fontWeight="bold" fontSize={14}>
                  {exercise.exercise}
                </B.LightText>
              </Div>
              <Icon name="edit" fontFamily="FontAwesome" fontSize={16} color={theme.primary.onColor} mr={12} />
            </Div>
            <Div flexDir="row" />
            <B.Spacer h={16} />
          </Div>
        ))}
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

export default WorkoutEditScreen
