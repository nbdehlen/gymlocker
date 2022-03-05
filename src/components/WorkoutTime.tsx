import React, { FunctionComponent, useState } from 'react'
import format from 'date-fns/format'
import { Platform } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Div, Input } from 'react-native-magnus'
import DateTimePicker from '@react-native-community/datetimepicker'
import theme, { B } from '../utils/theme'

type RefProps = {
  startDate: Date
  endDate: Date
}

type OwnProps = {
  forwardedRef: React.MutableRefObject<RefProps>
}

type Props = OwnProps

const WorkoutTime: FunctionComponent<Props> = ({ forwardedRef }) => {
  const [startDate, setStartDate] = useState(forwardedRef.current.startDate)
  const [endDate, setEndDate] = useState(forwardedRef.current.endDate)
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [pickerIndex, setPickerIndex] = useState(0)
  const minutes = (endDate.getTime() - startDate.getTime()) / (60 * 1000)
  const [min, setMin] = useState(minutes)

  // TODO: Implement validation w yup, final-form or similar.

  const onChangeMinutes = (minStr: string) => {
    const minNum = Number(minStr)
    if (minNum >= 0) {
      setMin(minNum)
    }
  }
  const onBlurMinutes = () => {
    const dateAsNum = startDate.getTime() + min * 60 * 1000
    const newEndDate = new Date(dateAsNum)
    setEndDate(newEndDate)
    forwardedRef.current = { startDate, endDate: newEndDate }
  }

  const onChangeDate = (_: Event, selectedDate?: Date) => {
    // From package docs example to not use Event param.
    setShow(Platform.OS === 'ios')

    // Make sure start is before or same as end and so on.
    if (selectedDate) {
      let diffMin: number | undefined
      // TODO: Untested on ios
      if (mode === 'date') {
        setStartDate(selectedDate)
        // Update endDate to same day as start date but keep endDate time of day.
        // TODO: This is not updating end time correctly
        const newEndDateNum = selectedDate.setHours(
          endDate.getHours(),
          endDate.getMinutes(),
          endDate.getSeconds(),
          endDate.getMilliseconds()
        )

        setEndDate(new Date(newEndDateNum))
        const newMin = (newEndDateNum - selectedDate.getTime()) / (60 * 1000)
        setMin(newMin)
        forwardedRef.current = { startDate: selectedDate, endDate: new Date(newEndDateNum) }
      } else if (mode === 'time' && pickerIndex === 0 && selectedDate.getTime() <= endDate.getTime()) {
        setStartDate(selectedDate)
        diffMin = (endDate.getTime() - selectedDate.getTime()) / (60 * 1000)
        forwardedRef.current = { startDate: selectedDate, endDate }
      } else if (mode === 'time' && pickerIndex === 1 && selectedDate.getTime() >= startDate.getTime()) {
        setEndDate(selectedDate)
        diffMin = (selectedDate.getTime() - startDate.getTime()) / (60 * 1000)
        forwardedRef.current = { startDate, endDate: selectedDate }
      }
      if (diffMin != null) {
        setMin(diffMin)
      }
    }
  }

  const showMode = (currentMode: string) => {
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
    <Div flexDir="row" mt={20}>
      <Div flex={1} alignItems="flex-start">
        <TouchableWithoutFeedback onPress={showDatepicker}>
          <B.LightText fontSize={12}>Start date</B.LightText>
          <B.LightText fontSize={16} rounded={4} px={6} py={2} borderWidth={1} borderColor={theme.primary.border}>
            {format(startDate, 'dd MMM yy')}
          </B.LightText>
        </TouchableWithoutFeedback>
      </Div>

      <Div flex={1} alignItems="center">
        <TouchableWithoutFeedback onPress={() => showTimepicker(0)}>
          <B.LightText fontSize={12}>Start time</B.LightText>
          <B.LightText fontSize={16} borderWidth={1} borderColor={theme.primary.border} rounded={4} px={6} py={2}>
            {format(startDate, 'HH:mm')}
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
        <Div>
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
        </Div>
      </Div>
      {show && (
        <DateTimePicker
          value={pickerIndex === 0 ? startDate : endDate}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )}
    </Div>
  )
}
export default WorkoutTime
