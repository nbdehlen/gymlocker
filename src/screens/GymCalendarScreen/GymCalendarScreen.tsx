import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Button, Div, Icon, Text } from 'react-native-magnus'
import theme, { B } from '../../utils/theme'
import { Calendar, CalendarList, Agenda, DateObject } from 'react-native-calendars'
import {
  differenceInMinutes,
  endOfDay,
  endOfWeek,
  format,
  getDay,
  getDaysInMonth,
  isFirstDayOfMonth,
  startOfDay,
  startOfWeek,
} from 'date-fns'
import { WorkoutModel } from '../../data/entities/WorkoutModel'
import { useDatabaseConnection } from '../../data/Connection'
import { Between } from 'typeorm'
import { nextSunday } from 'date-fns/esm'
import { useNavigation, useNavigationState } from '@react-navigation/core'
import { ScreenRoute } from '../../navigation/NAV_CONSTANTS'

type OwnProps = {}

type Props = OwnProps

// function to set dot color to white
const dotColor = (color: string) => (color = 'white')

const cardio = { key: 'cardio', color: 'red' }
// const exercise = {key:'exercise', color: 'blue', selectedDotColor: 'blue'};
const workoutOne = { key: 'workout-0', color: theme.primary.onColor, selectedDotColor: 'red' }
const workoutTwo = { key: 'workout-1', color: theme.primary.onColor, selectedDotColor: 'red' }
const workoutThree = { key: 'workout-2', color: theme.primary.onColor, selectedDotColor: 'red' }
const workoutDot = (i: number) => ({ key: `workout-${i}`, color: theme.primary.onColor })

// TODO: get dots based on cardio/exercise mix? or just count ++ blue dots

const getCalendarSpan = (today: string) => {
  const firstOfTheMonth = today.concat().slice(0, 7).concat('-01')
  const lastOfTheMonth = today
    .concat()
    .slice(0, 7)
    .concat('-', getDaysInMonth(new Date(today)).toString())

  const prevMon = startOfWeek(new Date(firstOfTheMonth), { weekStartsOn: 1 })
  const nextSun = endOfWeek(new Date(lastOfTheMonth), { weekStartsOn: 1 })

  return { start: String(prevMon), end: String(nextSun) }
}

// TODO: on month swipe/click - new workout fetch and set date to 1st? ???

// TODO: card and smart logic for display workout overview

// TODO: think about how to send the data?

// TODO: Left drawer on calendar screen for weight and calories?

export const GymCalendarScreen: FunctionComponent<Props> = () => {
  const { workoutRepository } = useDatabaseConnection()
  const [workouts, setWorkouts] = useState<WorkoutModel[]>([])
  const today = format(new Date(), 'yyyy-MM-dd')
  const [selected, setSelected] = useState(today)
  const { start, end } = useMemo(() => getCalendarSpan(selected), [selected])
  const [markedDates, setMarkedDates] = useState({})
  const navigation = useNavigation()

  useEffect(() => {
    // TODO: merge this somehow
    workoutRepository.getBetweenDates(start, end, ['exercises']).then(setWorkouts)
  }, [workoutRepository, selected])

  useEffect(() => {
    if (workouts?.length > 0) {
      const final = {}
      workouts.map((workout, i) => {
        const date = format(workout.start, 'yyyy-MM-dd')

        if (final[date]) {
          final[date] = { id: i, selected: false, dots: [...final[date].dots, workoutDot(i + 1)] }
        } else {
          final[date] = { id: i, selected: false, dots: [workoutDot(i + 1)] }
        }
      })

      const newMarkedDates = { ...markedDates, ...final }
      // TODO: !!!!!!!!!!!!! set workouts and markedDates on month change
      setMarkedDates(newMarkedDates)
    } else {
      setMarkedDates({})
    }
  }, [workouts])

  const setDots = (selected: string) => {
    // console.log('NEW MARKED DATES', markedDates)

    if (!markedDates[selected] || !markedDates[selected]?.dots) {
      return null
    }
    return markedDates[selected].dots.map((dot, i) => ({ key: `temp-${i}`, color: 'white' }))
  }

  const onChangeMonth = (month: DateObject) => {
    // TODO: Only update dots when month change?
    setSelected(month.dateString)
  }
  const onDayPress = (date: DateObject) => {
    setSelected(date.dateString)
  }

  const onPressWorkout = (workout: WorkoutModel | {} = {}) =>
    navigation.navigate(ScreenRoute.ADD_EDIT, { workout })

  return (
    <Div flex={1} bg={theme.background} pt={32}>
      <ScrollView>
        <Calendar
          firstDay={1}
          renderArrow={(direction) => {
            if (direction === 'left') {
              return (
                <Icon
                  fontFamily="SimpleLineIcons"
                  name="arrow-left"
                  color={theme.primary.onColor}
                  fontSize={16}
                />
              )
            }
            if (direction === 'right') {
              return (
                <Icon
                  fontFamily="SimpleLineIcons"
                  name="arrow-right"
                  color={theme.primary.onColor}
                  fontSize={16}
                />
              )
            }
          }}
          // showWeekNumbers={true} // TODO: click weekly to see goals?
          onDayPress={onDayPress}
          markingType={'multi-dot'}
          // markingType="custom" // should this be custom???
          onMonthChange={onChangeMonth}
          markedDates={{
            ...markedDates,
            [selected]: {
              selected: true,
              dots: setDots(selected),
              // dots: [{ key: 'temp-25', color: 'red' }],
              disableTouchEvent: true,
              // ...(markedDates.hasOwnProperty(selected) ? markedDates[selected] : {}),
            },
            // '2021-06-03': {
            //   selected: false,
            //   dots: [{ key: 'temp-25', color: 'white' }],
            // },
          }}
          enableSwipeMonths={true}
          disabledByDefault={false}
          headerStyle={{ backgroundColor: theme.primary.color }}
          theme={{
            arrowColor: theme.primary.onColor,
            // backgroundColor: '#030202',
            // calendarBackground: theme.secondary.color,
            calendarBackground: theme.primary.color,
            textSectionTitleColor: theme.light_1,
            // textSectionTitleDisabledColor: '#d9e1e8',
            // selectedDayBackgroundColor: '#00adf5',
            // selectedDayTextColor: theme.,
            dayTextColor: theme.light_1,
            textDisabledColor: theme.placeholder_opacity,
            // dotColor: theme.primary.onColor,
            selectedDotColor: '#ffffff',
            // disabledArrowColor: '#d9e1e8',
            // todayTextColor: theme.light_1,
            todayTextColor: theme.primary.onColor,
            monthTextColor: theme.light_1,
            indicatorColor: theme.primary.onColor,
            selectedDayBackgroundColor: theme.primary.onColor,
            // textDayFontFamily: font.Nunito_400Regular,
            // textMonthFontFamily: font.Nunito_600SemiBold,
            // textDayHeaderFontFamily: font.Nunito_400Regular,
            textDayFontSize: 12,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 13,
          }}
        />
        <B.Spacer h={16} />
        <Button alignSelf="center" w="90%" rounded={6} onPress={() => onPressWorkout()}>
          <Text color={theme.light_1} fontSize={14}>
            Add workout
          </Text>
        </Button>
        <B.Spacer h={32} />
        {workouts &&
          workouts.map(
            (workout) =>
              format(new Date(workout.start), 'yyyy-MM-dd') === selected && (
                <Div
                  key={workout.id}
                  bg={theme.primary.color}
                  // w="10%"
                  // mr={16}
                  // ml={16}
                  // mb={32}
                  justifyContent="center"
                  // alignItems="center"
                >
                  <Div
                    flexDir="row"
                    flex={1}
                    justifyContent="center"
                    alignSelf="center"
                    // alignSelf="flex-end"
                    // alignItems="flex-start"
                    // borderWidth={1}
                    borderBottomWidth={1}
                    // rounded={4}
                    borderColor="rgba(255,255,255,0.4)"
                    w="90%"
                    pb={4}>
                    <Div flex={1} alignItems="center">
                      <Text color={theme.light_1} fontSize={14}>
                        23
                      </Text>
                      <Text color={theme.light_1} fontSize={12}>
                        sets
                      </Text>
                    </Div>
                    <B.Spacer w={16} />
                    <Div flex={1} alignItems="center">
                      <Text color={theme.light_1} fontSize={14}>
                        60
                      </Text>
                      <Text color={theme.light_1} fontSize={12}>
                        cal
                      </Text>
                    </Div>
                    <B.Spacer w={16} />
                    <Div flex={1} alignItems="center">
                      <Text color={theme.light_1} fontSize={14}>
                        3.2
                      </Text>
                      <Text color={theme.light_1} fontSize={12}>
                        km
                      </Text>
                    </Div>
                    <B.Spacer w={16} />
                    <Div flex={1} alignItems="center">
                      <Text color={theme.light_1} fontSize={14}>
                        90
                      </Text>
                      <Text color={theme.light_1} fontSize={12}>
                        min
                      </Text>
                    </Div>
                    <Div alignItems="flex-end" justifyContent="center">
                      <Icon
                        fontFamily="SimpleLineIcons"
                        name="arrow-right"
                        color={theme.primary.onColor}
                        fontSize={16}
                      />
                    </Div>
                  </Div>
                  {/* <B.Spacer h={16} />
                  <Button alignSelf="center" w="90%" onPress={() => onPressWorkout(workout)}>
                    <Text color={theme.light_1} fontSize={14}>
                      {`Edit workout ${differenceInMinutes(workout.end, workout.start)}m`}
                    </Text>
                  </Button> */}
                  <B.Spacer h={32} />
                </Div>
              )
          )}
      </ScrollView>
    </Div>
  )
}

export default GymCalendarScreen
