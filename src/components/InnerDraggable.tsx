import React, { FunctionComponent, useCallback, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { Div, Icon, Text } from 'react-native-magnus'
import { SetModel } from '../data/entities/SetModel'
import theme from '../utils/theme'

type OwnProps = {
  sets: SetModel[]
}

type Props = OwnProps

const HEADERS = ['WEIGHT', 'REPS', '']

const InnerDraggable: FunctionComponent<Props> = ({ sets }) => {
  const [nested, setNested] = useState(sets)

  const RenderHeader = useCallback(
    ({ headers }: { headers: string[] }) => (
      <Div flexDir="row" flex={1} h={20}>
        {headers.map((header, i) => (
          <Div flex={1} alignItems="center" key={i}>
            <Text fontSize={13} color={theme.light_1}>
              {header}
            </Text>
          </Div>
        ))}
      </Div>
    ),
    []
  )

  const renderInner = useCallback(({ item, drag, isActive }: any) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity onLongPress={drag} disabled={isActive} style={{ flexDirection: 'row' }}>
          {/* <Div style={{ alignItems: 'center', flex: 1 }} py={8}> */}
          <Div alignItems="center" flex={1} py={8}>
            <Text style={{ fontSize: 14, color: theme.light_1 }}>{item?.weight_kg} kg</Text>
          </Div>
          <Div alignItems="center" flex={1} py={8}>
            <Text style={{ fontSize: 14, color: theme.light_1 }}>{item?.repetitions}</Text>
          </Div>
          <Div alignItems="center" flex={1} py={8}>
            <Icon name="edit" fontFamily="FontAwesome" fontSize={16} color={theme.primary.onColor} />
          </Div>
        </TouchableOpacity>
      </ScaleDecorator>
    )
  }, [])

  return (
    <DraggableFlatList
      ListHeaderComponent={<RenderHeader headers={HEADERS} />}
      containerStyle={{ flexDirection: 'row', backgroundColor: theme.primary.color }}
      data={nested}
      onDragEnd={({ data }) => setNested(data)}
      keyExtractor={(item, index) => `${item.id} ${index}`}
      renderItem={renderInner}
    />
  )
}

export default React.memo(InnerDraggable)
