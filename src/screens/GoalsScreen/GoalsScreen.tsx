import React, { FunctionComponent, useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Collapsible from 'react-native-collapsible'
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import { Text } from 'react-native-magnus'
import { useDatabaseConnection } from '../../data/Connection'
import exercisesSelect from '../../data/seeding/starter/exercisesSelect'
import { NEW_INSTALL } from '../../storageConstants'
import { getData } from '../../utils/asyncStorage'

const NUM_ITEMS = 8
const NUM_ITEMS_TWO = 5
function getColor(i: number) {
  const multiplier = 255 / (NUM_ITEMS - 1)
  const colorVal = i * multiplier
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`
}

type Item = {
  key: string
  label: string
  height: number
  width: number
  backgroundColor: string
}

const initialData: Item[] = [...Array(NUM_ITEMS)].map((d, index) => {
  const backgroundColor = getColor(index)
  return {
    key: `item-${index}`,
    label: String(index) + '',
    height: 100,
    width: 60 + Math.random() * 40,
    backgroundColor
  }
})

const initialNested = [...Array(NUM_ITEMS_TWO)].map((d, index) => {
  const backgroundColor = getColor(index)
  return {
    key: `nested-${index}`,
    label: String(index) + 'YAYAAOOO',
    height: 100,
    width: 60 + Math.random() * 40,
    backgroundColor
  }
})

const InnerDraggable: FunctionComponent<any> = () => {
  const [nested, setNested] = useState(initialNested)

  const renderInner = ({ item, drag, isActive }: any) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[styles.rowItem, { backgroundColor: isActive ? 'red' : item.backgroundColor }]}
        >
          <Text style={styles.text}>{item.label}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    )
  }

  return (
    <DraggableFlatList
      data={nested}
      onDragEnd={({ data }) => setNested(data)}
      keyExtractor={(item) => item.key}
      renderItem={renderInner}
    />
  )
}

type OwnProps = {}

type Props = OwnProps

export const GoalsScreen: FunctionComponent<Props> = () => {
  const { exerciseSelectRepository } = useDatabaseConnection()

  useEffect(() => {
    const checkInstall = async () => {
      const res = await getData(NEW_INSTALL)
      if (!res) {
        exerciseSelectRepository.createMany(exercisesSelect)
      }
    }
    checkInstall()
  }, [exerciseSelectRepository])

  const [data, setData] = useState(initialData)
  const [expanded, setExpanded] = useState<string[]>([])
  const toggleExpand = (i: string) => {
    if (expanded.includes(i)) {
      const newExpanded = [
        ...expanded.slice(0, expanded.indexOf(i)),
        ...expanded.slice(expanded.indexOf(i) + 1, expanded.length)
      ]
      setExpanded(newExpanded)
    } else {
      setExpanded([...expanded, i])
    }
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          onPress={() => toggleExpand(item.key)}
          disabled={isActive}
          style={[styles.rowItem, { backgroundColor: isActive ? 'red' : item.backgroundColor }]}
        >
          <Text style={styles.text}>{item.label}</Text>
          <Collapsible collapsed={!expanded.includes(item.key)}>
            <InnerDraggable />
          </Collapsible>
        </TouchableOpacity>
      </ScaleDecorator>
    )
  }

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => setData(data)}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
    />
  )
}

const styles = StyleSheet.create({
  rowItem: {
    // height: 100,
    // width: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default GoalsScreen
