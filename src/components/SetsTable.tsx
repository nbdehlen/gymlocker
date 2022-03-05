import React, { FunctionComponent } from 'react'
import { Text, Div, Icon } from 'react-native-magnus'
import { SetModel } from '../data/entities/SetModel'
import theme from '../utils/theme'

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
        <Div mb={i === sets?.length - 1 ? 'md' : 'sm'} mt={i === 0 ? 'sm' : 0} flexDir="row" flex={1} key={i}>
          <Div alignItems="center" flex={1} py="md">
            <Text style={{ fontSize: 14, color: theme.light_1 }}>{set?.weight_kg} kg</Text>
          </Div>
          <Div alignItems="center" flex={1} py="md">
            <Text style={{ fontSize: 14, color: theme.light_1 }}>{set?.repetitions}</Text>
          </Div>
          <Div style={{ alignItems: 'center', flex: 1 }} py="md">
            <Icon name="lock" fontFamily="FontAwesome" fontSize="xl" color={theme.primary.border} />
          </Div>
        </Div>
      ))}
    </Div>
  )
}

export default React.memo(SetsTable)
