import React, { FunctionComponent, ReactNode, useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView, View } from 'react-native'
import { Checkbox, Div, Text } from 'react-native-magnus'
import { SafeAreaView } from 'react-native-safe-area-context'
import theme from '../../utils/theme'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryStack, VictoryTheme } from 'victory-native'
import { useDatabaseConnection } from '../../data/Connection'
import { MusclesCount } from '../../data/repositories/ExerciseRepository'
import OptionsGroup, { OptionsGroupData } from '../../components/OptionsGroup'
import { format, subDays } from 'date-fns'
import mergeOnKey from '../../helpers/mergeOnKey'
import Slider, { SliderRef } from '@react-native-community/slider'

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

const handleMultilineText = (d: MusclesCount) => createMultilineText(d.muscle, 6, 14)

const renderVictoryAxis = (muscles: MusclesCount[]): ReactNode[] => {
  const labels = muscles.map((d, i) => (
    <VictoryAxis dependentAxis key={i} label={d.muscle} style={{ tickLabels: { fill: 'none' } }} axisValue={d.muscle} />
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

const displayLabel = (data: MusclesCount): string => {
  // rounding secondary muscle to one decimal as to not get x.99999.
  if (data.count === 0) {
    return `(${Math.round(data?.ast_count ? data.ast_count * 10 : 0) / 10})`
  } else if (data.ast_count === 0) {
    return `${data.count}`
  } else {
    return `${data.count} (${Math.round(data?.ast_count ? data.ast_count * 10 : 0) / 10})`
  }
}

export const ChartsScreen: FunctionComponent<Props> = () => {
  const { exerciseRepository } = useDatabaseConnection()
  const [curOption, setCurOption] = useState<OptionsGroupData>(optionsGroupData[0])
  const [mergedMuscles, setMergedMuscles] = useState<MusclesCount[]>([])
  const [muscles, setMuscles] = useState<MusclesCount[]>([])
  const [includeAssisting, setIncludeAssisting] = useState(false)
  const [weighting, setWeighting] = useState(100)

  const handleMuscleCounts = async (from: string, weight: number) => {
    const musclesData = await exerciseRepository.getMuscleCounts(from)
    setMuscles(musclesData)

    const astMusclesData = await exerciseRepository.getAstMuscleCounts(from, weight / 100)
    const defaultData: Partial<MusclesCount> = { count: 0, ast_count: 0 }
    const data = mergeOnKey<MusclesCount>(musclesData, astMusclesData, 'muscle', defaultData)
    setMergedMuscles(data)
  }

  const handleButtonOptions = (selected: OptionsGroupData[]) => {
    setCurOption(selected[0])
    handleMuscleCounts(dateToNum[selected[0].text], weighting)
  }

  type MySliderRef = (React.LegacyRef<Slider> & React.MutableRefObject<SliderRef>) | undefined
  const sliderRef = useRef() as MySliderRef

  useEffect(() => {
    // TODO: Only sliders: period slider, [1d, this week, 1w, this month, 1m, 3m, 6m, 1y, all]
    //        starting out at 0% assisting and show one number?
    // TODO: Include assisting muscles with a optional weight
    // TODO: Make component for period and availableMods (same one)
    // TODO: Averages/Period or Totals/Period - of muscles for example

    handleMuscleCounts(dateToNum[curOption.text], weighting)
  }, [])

  const toggleAssisting = () => setIncludeAssisting((prev) => !prev)

  return (
    <SafeAreaView
      style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary.color, flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ alignContent: 'center', alignItems: 'center' }}>
        <Text fontSize={40} color={theme.primary.onColor}>
          Charts
        </Text>
        <OptionsGroup
          optionsTitle="Period:"
          displayKey="text"
          minSelected={1}
          maxSelected={1}
          selected={[curOption]}
          options={optionsGroupData}
          getSelected={handleButtonOptions}
        />

        <Div flexDir="row" alignItems="center" justifyContent="flex-start" w="100%">
          <Checkbox onPress={toggleAssisting} activeColor={theme.primary.onColor} highlightBg={theme.dark_1} />
          <Text color={theme.light_1} fontSize={16} ml={6}>
            Include assisting muscles
          </Text>
        </Div>
        {includeAssisting && (
          <Div w="100%">
            <Text color={theme.light_1} fontSize={16} ml={6}>
              {`Weight: ${weighting}%`}
            </Text>
            <Slider
              ref={sliderRef}
              value={weighting}
              maximumValue={100}
              minimumValue={0}
              step={5}
              minimumTrackTintColor={theme.primary.onColor}
              maximumTrackTintColor="#01579B"
              onValueChange={(value) => {
                ; (sliderRef?.current as Slider).setNativeProps({ value })
                console.log(value)
              }}
              onSlidingComplete={(value) => {
                if (value !== weighting) {
                  setWeighting(value)
                  handleMuscleCounts(dateToNum[curOption.text], value)
                }
              }}
              thumbTintColor={theme.primary.onColor}
            />
          </Div>
        )}
        <View style={{ backgroundColor: theme.primary.color }}>
          {mergedMuscles.length > 1 && (
            <VictoryChart
              domainPadding={{ y: 20, x: 12 }}
              padding={{ left: 100, top: 40, bottom: 40, right: 24 }}
              // TODO: height based on muscles count
              // TODO: Click label 'quads' to see quads sets week over week and similar
              height={mergedMuscles.length > 10 ? 600 : 300}
              width={Dimensions.get('window').width}
            >
              <VictoryStack
                style={{
                  labels: { fontSize: 14, fill: '#ffffff' },
                }}
                labels={({ datum }: { datum: MusclesCount }) =>
                  includeAssisting ? displayLabel(datum) : datum.count ?? 0
                }
                labelComponent={<VictoryLabel dx={6} />}
              >
                {mergedMuscles.length > 1 && (
                  <VictoryBar
                    horizontal
                    data={!includeAssisting ? muscles : mergedMuscles}
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
                  />
                )}
                {mergedMuscles.length > 1 && includeAssisting && (
                  <VictoryBar
                    horizontal
                    data={mergedMuscles}
                    y="ast_count"
                    x={handleMultilineText}
                    barWidth={14}
                    style={{
                      data: {
                        fill: '#9900ff78',
                        stroke: '#007bff78',
                        fillOpacity: 1000,
                        strokeWidth: 1,
                      },
                    }}
                  />
                )}
              </VictoryStack>
              <VictoryAxis
                standalone={false}
                style={{
                  tickLabels: { fill: '#fff' },
                }}
              />
            </VictoryChart>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ChartsScreen
