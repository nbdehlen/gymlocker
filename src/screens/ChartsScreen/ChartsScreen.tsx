import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react'
import { Dimensions, ScrollView, View } from 'react-native'
import { Text } from 'react-native-magnus'
import { SafeAreaView } from 'react-native-safe-area-context'
import theme from '../../utils/theme'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from 'victory-native'
import { useDatabaseConnection } from '../../data/Connection'
import { MusclesCount } from '../../data/repositories/ExerciseRepository'
import OptionsGroup, { OptionsGroupData } from '../../components/OptionsGroup'
import { format, subDays } from 'date-fns'

const createMultilineText = (text: string, cutoff: number, minLength: number) => {
  if (typeof text !== 'string') {
    return ''
  }
  const firstWhiteSpace = text.indexOf(' ')
  if (firstWhiteSpace >= cutoff && text.length >= minLength) {
    const first = text.slice(0, firstWhiteSpace)
    const second = text.slice(firstWhiteSpace + 1, text.length)
    return `${first}\n${second}`
  }
  return text
}

const renderVictoryAxis = (muscles: MusclesCount[]): ReactNode[] => {
  const labels = muscles.map((d, i) => (
    <VictoryAxis
      dependentAxis
      key={i}
      label={d.muscles_muscle}
      style={{ tickLabels: { fill: 'none' } }}
      axisValue={d.muscles_muscle}
    />
  ))

  return labels
}

type OwnProps = {}

type Props = OwnProps

const optionsGroupData = [
  { text: '7d', id: 0 },
  { text: '1m', id: 1 },
  { text: '3m', id: 2 },
  { text: '1y', id: 3 },
]

const getDaysAgoDate = (daysAgo: number): string => {
  const date = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd')
  return date
}

type DateToNum = {
  [key: string]: string
}

const dateToNum: DateToNum = {
  ['7d']: getDaysAgoDate(7),
  ['1m']: getDaysAgoDate(30),
  ['3m']: getDaysAgoDate(90),
  ['1y']: getDaysAgoDate(365),
}

export const ChartsScreen: FunctionComponent<Props> = () => {
  const { exerciseRepository } = useDatabaseConnection()
  const [muscles, setMuscles] = useState<MusclesCount[]>([])
  const [curOption, setCurOption] = useState<OptionsGroupData>(optionsGroupData[0])

  const getMuscleCounts = async (from: string) => {
    return await exerciseRepository.getMuscleCounts(from).then(setMuscles)
  }

  const handleButtonOptions = (selected: OptionsGroupData[]) => {
    setCurOption(selected[0])
    getMuscleCounts(dateToNum[selected[0].text])
  }

  const hasMuscles = muscles?.length > 0
  const handleMultilineText = (d: MusclesCount) => createMultilineText(d.muscles_muscle, 6, 14)

  useEffect(() => {
    console.log('getMuscleCounts')
    // TODO: Include assisting muscles with a optional weight
    // TODO: Make component for period and availableMods (same one)
    // TODO: Averages/Period or Totals/Period - of muscles for example

    getMuscleCounts(dateToNum[curOption.text])
  }, [])

  return (
    <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary.color }}>
      <ScrollView contentContainerStyle={{ alignContent: 'center', alignItems: 'center' }}>
        <Text fontSize={40} color={theme.primary.onColor}>
          Charts
        </Text>
        <OptionsGroup
          optionsTitle="Period:"
          displayKey={'text'}
          minSelected={1}
          maxSelected={1}
          selected={[curOption]}
          options={optionsGroupData}
          getSelected={handleButtonOptions}
        />

        {hasMuscles && (
          <View style={{ backgroundColor: theme.primary.color }}>
            <VictoryChart
              domainPadding={{ y: 20, x: 12 }}
              padding={{ left: 100, top: 40, bottom: 40, right: 20 }}
              // TODO: height based on muscles count
              height={muscles.length > 10 ? 600 : 300}
              width={Dimensions.get('window').width}
            >
              <VictoryBar
                horizontal
                data={muscles}
                y="count"
                x={handleMultilineText}
                barWidth={14}
                style={{
                  data: {
                    fill: '#007bff78',
                    stroke: '#007bff78',
                    fillOpacity: 1000,
                    strokeWidth: 1,
                  },
                  labels: { fontSize: 14, fill: '#ffffff' },
                }}
                labels={({ datum }) => datum.count}
              />

              <VictoryAxis
                standalone={false}
                style={{
                  tickLabels: { fill: '#fff' },
                }}
              />
            </VictoryChart>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ChartsScreen
