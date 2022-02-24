import React, { FunctionComponent } from 'react'
import { Text, Div, Icon } from 'react-native-magnus'
import { SetModel } from '../data/entities/SetModel'
import theme, { B } from '../utils/theme'

type ExerciseTableProps = {
  sets: SetModel[]
  headers?: string[]
}
const SetsTable: FunctionComponent<ExerciseTableProps> = ({ sets, headers }) => {
  return (
    <Div>
      <Div flexDir="row" flex={1}>
        {headers &&
          headers.map((header, i) => (
            <Div alignItems="center" flex={1} key={i}>
              <Text fontSize={13} color={theme.light_1}>
                {header}
              </Text>
            </Div>
          ))}
      </Div>
      {sets.map((set, i) => (
        <Div mb={8} flexDir="row" flex={1} key={set.id}>
          <Div style={{ alignItems: 'center', flex: 1 }} py={8}>
            <Text style={{ fontSize: 14, color: theme.light_1 }}>{`${set.weight_kg} kg`}</Text>
          </Div>
          <Div style={{ alignItems: 'center', flex: 1 }} py={8}>
            <Text style={{ fontSize: 14, color: theme.light_1 }}>{set.repetitions}</Text>
          </Div>
          <Div style={{ alignItems: 'center', flex: 1 }} py={8}>
            <Icon name="edit" fontFamily="FontAwesome" fontSize={16} />
          </Div>
        </Div>
      ))}
    </Div>
  )
}

export default SetsTable
