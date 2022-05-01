import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, TextComponent, TouchableOpacity } from 'react-native'
import { Button, Div, Icon, Text } from 'react-native-magnus'
import theme, { B } from '../../utils/theme'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'
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
import { useNavigation } from '@react-navigation/core'
import { DrawerRoute, ScreenRoute } from '../../navigation/NAV_CONSTANTS'
import DrawerNavigation from '../../navigation/DrawerNavigation'
import WorkoutSummary from '../../components/WorkoutSummary'
import CustomButton, { ButtonEnum } from '../../components/CustomButton'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

type OwnProps = {}

type Props = OwnProps

// function to set dot color to white
const dotColor = (color: string) => (color = 'white')

//TODO: Update dots when workout is removed/added
//TODO: calendar entries are not shown on first render

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

// TODO: think about how to send the data?

// TODO: Left drawer on calendar screen for weight and calories eaten?

export const GymCalendarScreen: FunctionComponent<Props> = () => {
  const { workoutRepository } = useDatabaseConnection()
  const [workouts, setWorkouts] = useState<WorkoutModel[]>([])
  const today = format(new Date(), 'yyyy-MM-dd')
  const [selected, setSelected] = useState(today)
  const [selectedWorkouts, setSelectedWorkouts] = useState<WorkoutModel[]>([])
  const { start, end } = useMemo(() => getCalendarSpan(selected), [selected])
  const [markedDates, setMarkedDates] = useState({})
  const navigation = useNavigation()

  // TODO: If today has workouts they are not shown in the list until you click another date and go back

  useEffect(() => {
    // TODO: merge this somehow
    workoutRepository.getBetweenDates(start, end, ['exercises', 'exercises.sets', 'cardios']).then(setWorkouts)
  }, [workoutRepository, selected, start, end])

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

      // const newMarkedDates = { ...markedDates, ...final }
      // TODO: !!!!!!!!!!!!! set workouts and markedDates on month change
      setMarkedDates((prev) => ({ ...prev, ...final }))
    } else {
      setMarkedDates({})
    }
  }, [workouts])

  const updateSelectedWorkout = (day: string) => {
    const todaysWorkouts = workouts.filter((workout) => format(new Date(workout?.start), 'yyyy-MM-dd') === day)
    const todaysWorkoutIds = todaysWorkouts.map((workout) => workout.id)
    workoutRepository
      .getManyById(todaysWorkoutIds, ['exercises', 'exercises.sets', 'cardios'])
      .then((data) => data && setSelectedWorkouts(data))
  }

  const updateDots = (selected: string) => {
    if (!markedDates[selected] || !markedDates[selected]?.dots) {
      return null
    }
    return markedDates[selected].dots.map((dot, i) => ({ key: `temp-${i}`, color: 'white' }))
  }

  const onChangeMonth = (month: any) => {
    const day = month.dateString.slice(0, 8) + '01'

    // TODO: Only update dots when month change?
    setSelected(day)
    updateSelectedWorkout(day)
  }
  const onDayPress = (date: any) => {
    const day = date.dateString
    setSelected(day)
    updateSelectedWorkout(day)
  }

  const onPressAddWorkout = () =>
    addWorkout({
      id: uuidv4(),
      start: new Date(),
      end: new Date(Date.now() + 2 * 60 * 60 * 1000),
      cardios: [],
      exercises: [],
    })

  const addWorkout = (workout: WorkoutModel) =>
    navigation.navigate(DrawerRoute.GYM_DRAWER, { screen: ScreenRoute.WORKOUT_EDIT, params: { workout } })

  const onPressEditWorkout = async (workout: WorkoutModel) => {
    const detailedWorkout = await workoutRepository.getById(workout.id, [
      'cardios',
      'exercises',
      'exercises.sets',
      'exercises.modifiers',
      'exercises.modifiers.modifier',
      'exercises.exerciseSelect',
      'exercises.exerciseSelect.muscles',
      'exercises.exerciseSelect.assistingMuscles',
      'exercises.exerciseSelect.modifiersAvailable',
      'exercises.exerciseSelect.modifiersAvailable.modifier',
    ])
    // TODO: Typeorm doesn't support sorting of relations afaik.
    // Should be possible in version 0.3 but ran into issues
    // updating to newer version of Typeorm.
    if (detailedWorkout) {
      const exercises = detailedWorkout.exercises?.sort((a, b) => a.order - b.order)

      navigation.navigate(ScreenRoute.WORKOUT_DETAILS, {
        workout: {
          ...detailedWorkout,
          exercises,
        },
      })
    }
  }

  return (
    <Div flex={1} bg={theme.background} pt={32}>
      <ScrollView>
        <Calendar
          firstDay={1}
          renderArrow={(direction) => {
            if (direction === 'left') {
              return <Icon fontFamily="SimpleLineIcons" name="arrow-left" color={theme.primary.onColor} fontSize={16} />
            }
            if (direction === 'right') {
              return (
                <Icon fontFamily="SimpleLineIcons" name="arrow-right" color={theme.primary.onColor} fontSize={16} />
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
              dots: updateDots(selected),
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
        <Div mt="2xl" />
        <Div mx="lg">
          <CustomButton
            onPress={onPressAddWorkout}
            text="Add workout"
            preset={ButtonEnum.PRIMARY}
            IconComponent={() => (
              <Icon fontSize="xl" fontFamily="AntDesign" name="plus" ml="sm" color={theme.primary.onColor} />
            )}
            iconSuffix
          />
          <Div mt="2xl" />
          {selectedWorkouts &&
            selectedWorkouts.map((selectedWorkout, i) => (
              <WorkoutSummary workout={selectedWorkout} onPress={onPressEditWorkout} key={i} /> // TODO: typing here
            ))}
        </Div>
      </ScrollView>
    </Div>
  )
}

export default GymCalendarScreen
