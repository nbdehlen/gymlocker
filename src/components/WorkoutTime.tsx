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
  const minutes = (endDate.getTime() - startDate.getTime()) / (60 * 1000)
  const [min, setMin] = useState(minutes)

  const onChangeMinutes = (minStr: string) => {
    const minNum = Number(minStr)
    if (minNum >= 0) {
      setMin(minNum)
      const newEndDate = startDate.getTime() + minNum * (60 * 1000)
      setEndDate(new Date(newEndDate))
      forwardedRef.current = { startDate, endDate: new Date(newEndDate) }
    }
  }

  const onChangeDate = (_: Event, selectedDate?: Date) => {
    // From package docs example to not use Event param.
    setShow(Platform.OS === 'ios')

    if (selectedDate) {
      // TODO: Untested on ios
      setStartDate(selectedDate)
      const newEndDate = new Date(selectedDate.getTime() + min * 60 * 1000)
      setEndDate(newEndDate)
      forwardedRef.current = { startDate: selectedDate, endDate: newEndDate }
    }
  }

  const showMode = (currentMode: string) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => showMode('date')

  const showTimepicker = () => showMode('time')

  return (
    <Div flexDir="row" mt={20} justifyContent="space-between">
      <Div alignItems="flex-start">
        <TouchableWithoutFeedback onPress={showDatepicker}>
          <B.LightText fontSize={12}>Start date</B.LightText>
          <B.LightText fontSize={16} rounded={4} px={6} py={2} borderWidth={1} borderColor={theme.primary.border}>
            {format(startDate, 'dd MMM yy')}
          </B.LightText>
        </TouchableWithoutFeedback>
      </Div>

      <Div alignItems="center">
        <TouchableWithoutFeedback onPress={showTimepicker}>
          <B.LightText fontSize={12}>Start time</B.LightText>
          <B.LightText fontSize={16} borderWidth={1} borderColor={theme.primary.border} rounded={4} px={6} py={2}>
            {format(startDate, 'HH:mm')}
          </B.LightText>
        </TouchableWithoutFeedback>
      </Div>

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
          placeholder="0"
        />
      </Div>
      {show && (
        <DateTimePicker value={startDate} mode={mode} is24Hour={true} display="default" onChange={onChangeDate} />
      )}
    </Div>
  )
}
export default WorkoutTime
