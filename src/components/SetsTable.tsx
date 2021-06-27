import React, { FunctionComponent } from 'react'
import { Text, Div, Icon } from 'react-native-magnus'
import { SetModel } from '../data/entities/SetModel'
import theme, { B } from '../utils/theme'

type ExerciseTableProps = {
  sets: SetModel[]
  headers?: string[]
}
const SetsTable: FunctionComponent<ExerciseTableProps> = ({ sets, headers }) => (
  <Div>
    <Div flexDir="row" flex={1}>
      {/* <Div flex={1}></Div> */}
      {headers &&
        headers.map((header) => (
          <Div alignItems="center" flex={1}>
            <Text fontSize={13} color={theme.light_1}>
              {header}
            </Text>
          </Div>
        ))}
    </Div>
    {sets.map((set, i) => (
      <Div mb={8} flexDir="row">
        {/* <Div alignItems="center" flex={1}>
          <Icon name="remove" fontFamily="FontAwesome" />
        </Div> */}
        <Div style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 14, color: theme.light_1 }}>{`${set.weight_kg} kg`}</Text>
        </Div>
        <Div style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 14, color: theme.light_1 }}>{set.repetitions}</Text>
        </Div>
        <Div style={{ alignItems: 'center', flex: 1 }}>
          <Icon name="edit" fontFamily="FontAwesome" fontSize={16} />
        </Div>
      </Div>
    ))}
  </Div>
)

export default SetsTable
