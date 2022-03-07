import React, { FunctionComponent, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, Div, Icon } from 'react-native-magnus'
import { SetModel } from '../data/entities/SetModel'
import { ICreateSetData } from '../data/repositories/SetRepository'
import theme from '../utils/theme'
import CustomButton, { ButtonEnum } from './CustomButton'
import CustomInput, { InputEnum } from './CustomInput'

type ExerciseTableProps = {
  sets: (SetModel | ICreateSetData)[]
  headers?: string[]
}

const SetsTable: FunctionComponent<ExerciseTableProps> = ({ sets, headers }) => {
  const [editable, setEditable] = useState<number | null>(null)
  const toggleEditSet = (i: number) => {
    setEditable(i)
  }
  const onPressSave = (i: number) => {
    setEditable(null)
  }

  return (
    <Div>
      <Div flexDir="row">
        {headers &&
          headers.map((header, i) => (
            <Div alignItems="center" flex={1} key={i}>
              <Text fontSize={13} color={theme.light_1}>
                {header}
              </Text>
            </Div>
          ))}
      </Div>
      {sets.map((set, i) => {
        const inputMode = editable === i

        return (
          <Div key={i}>
            <Div
              mb={i === sets?.length - 1 ? 0 : 'sm'}
              mt={i === 0 ? 'sm' : 0}
              flexDir="row"
              // key={i}
              // borderWidth={1}
              // borderColor={editable === i ? theme.primary.border : theme.background}
              rounded="sm"
              // bg={inputMode ? '#2e2c2c' : theme.background}
              bg={theme.background}
            >
              {inputMode && (
                <Div alignItems="center" flex={1} py="md">
                  <CustomInput initialValue={String(set.weight_kg)} preset={InputEnum.SET_INPUT} />
                </Div>
              )}
              {inputMode && (
                <Div alignItems="center" flex={1} py="md">
                  <CustomInput initialValue={String(set.repetitions)} preset={InputEnum.SET_INPUT} />
                </Div>
              )}
              {!inputMode && (
                <Div alignItems="center" flex={1} py="md">
                  <Text style={{ fontSize: 14, color: theme.light_1 }}>{set?.weight_kg} kg</Text>
                </Div>
              )}
              {!inputMode && (
                <Div alignItems="center" flex={1} py="md">
                  <Text style={{ fontSize: 14, color: theme.light_1 }}>{set?.repetitions}</Text>
                </Div>
              )}
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  flex: 1,
                  marginVertical: 8,
                  paddingVertical: 1,
                  borderBottomWidth: inputMode ? 1 : 0,
                  borderBottomColor: theme.light_1,
                }}
                onPress={inputMode ? () => onPressSave(i) : () => toggleEditSet(i)}
              >
                <Icon
                  name={inputMode ? 'unlock' : 'lock'}
                  fontFamily="FontAwesome"
                  fontSize={inputMode ? '5xl' : 'xl'}
                  // fontSize="xl"
                  // color={inputMode ? '#38bb3f' : theme.primary.border}
                  color={theme.primary.border}
                />
              </TouchableOpacity>
            </Div>
            {inputMode && (
              <Div flexDir="row" justifyContent="center" my="md">
                <CustomButton text="Delete" onPress={() => { }} preset={ButtonEnum.CANCEL} />
                <Div mx="sm" />
                <CustomButton
                  text="Cancel"
                  onPress={() => { }}
                  preset={ButtonEnum.CANCEL}
                  containerProps={{ borderColor: theme.light_1 }}
                  textProps={{ color: theme.light_1 }}
                />
              </Div>
            )}
          </Div>
        )
      })}
    </Div>
  )
}

export default React.memo(SetsTable)
