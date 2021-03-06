import React, { FunctionComponent, useEffect, useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { Text, Div, Icon } from 'react-native-magnus'
import { DeepPartial } from 'typeorm'
import { ExerciseModel } from '../data/entities/ExerciseModel'
import theme from '../utils/theme'
import CustomButton, { ButtonEnum } from './CustomButton'
import CustomInput, { InputEnum } from './CustomInput'

type ExerciseTableProps = {
  exercise: ExerciseModel | DeepPartial<ExerciseModel>
  exerciseIndex: number
  headers?: string[]
  editSet: any
}

const SetsTable: FunctionComponent<ExerciseTableProps> = ({ exercise, exerciseIndex, headers, editSet }) => {
  const [editable, setEditable] = useState<number | null>(null)
  const [sets, setSets] = useState(exercise?.sets)

  useEffect(() => {
    setSets(exercise?.sets)
  }, [exercise])

  const toggleEditSet = (i: number) => {
    setEditable(i)
  }
  const onPressSave = (setIndex: number) => {
    editSet(exercise, exerciseIndex, setIndex, sets[setIndex])
    setEditable(null)
  }

  const onChange = (e: string, i: number, type: string) => {
    const getRir = (rir: string): string | number => (rir === '' ? rir : Number(rir))

    const newSet = {
      weight_kg: type === 'weight' ? Number(e) : sets[i].weight_kg,
      repetitions: type === 'repetitions' ? Number(e) : sets[i].repetitions,
      rir: type === 'rir' ? getRir(e) : sets[i].rir,
    }
    setSets((prev) => [...prev.slice(0, i), { ...prev[i], ...newSet }, ...prev.slice(i + 1, prev?.length)])
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
              rounded="sm"
              bg={theme.background}
            >
              {inputMode && (
                <>
                  <Div alignItems="center" flex={1} py="md">
                    <CustomInput
                      value={sets[i].weight_kg > 0 ? String(sets[i].weight_kg) : ''}
                      preset={InputEnum.SET_INPUT}
                      onChangeText={(e) => onChange(e, i, 'weight')}
                      placeholder={'0'}
                      keyboardType={'number-pad'}
                    />
                  </Div>
                  <Div alignItems="center" flex={1} py="md">
                    <CustomInput
                      value={sets[i].repetitions > 0 ? String(sets[i].repetitions) : ''}
                      onChangeText={(e) => onChange(e, i, 'repetitions')}
                      placeholder={'0'}
                      preset={InputEnum.SET_INPUT}
                      keyboardType={'number-pad'}
                    />
                  </Div>
                  <Div alignItems="center" flex={1} py="md">
                    <CustomInput
                      value={typeof sets[i].rir === 'number' ? String(sets[i].rir) : ''}
                      onChangeText={(e) => onChange(e, i, 'rir')}
                      placeholder={'0'}
                      preset={InputEnum.SET_INPUT}
                      keyboardType={'number-pad'}
                    />
                  </Div>
                </>
              )}
              {!inputMode && (
                <>
                  <Div alignItems="center" flex={1} pt="md" pb={i === sets?.length - 1 ? 'lg' : 'md'}>
                    <Text style={{ fontSize: 14, color: theme.light_1 }}>
                      {set.weight_kg ? `${set.weight_kg} kg` : 'bw'}
                    </Text>
                  </Div>
                  <Div alignItems="center" flex={1} pt="md" pb={i === sets?.length - 1 ? 'lg' : 'md'}>
                    <Text style={{ fontSize: 14, color: theme.light_1 }}>{set?.repetitions ?? 0}</Text>
                  </Div>
                  <Div alignItems="center" flex={1} pt="md" pb={i === sets?.length - 1 ? 'lg' : 'md'}>
                    <Text style={{ fontSize: 14, color: theme.light_1 }}>{set?.rir ?? 0}</Text>
                  </Div>
                </>
              )}
              <Div
                alignItems="center"
                flex={1}
                mt={'sm'}
                mb={i === sets?.length - 1 ? 0 : 'sm'}
                py={1}
                borderBottomWidth={inputMode ? 1 : 0}
                borderBottomColor={theme.light_1}
              >
                <TouchableWithoutFeedback onPress={inputMode ? () => onPressSave(i) : () => toggleEditSet(i)}>
                  <Icon
                    name={inputMode ? 'unlock' : 'lock'}
                    fontFamily="FontAwesome"
                    fontSize={inputMode ? '5xl' : 'xl'}
                    color={theme.primary.border}
                  />
                </TouchableWithoutFeedback>
              </Div>
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
