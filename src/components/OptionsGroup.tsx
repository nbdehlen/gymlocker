import React, { FunctionComponent, useState } from 'react'
import { Div, Text } from 'react-native-magnus'
import theme from '../utils/theme'
import CustomButton, { ButtonEnum } from './CustomButton'

const compare = (option: OptionsGroupData, selected: OptionsGroupData[]): boolean => {
  const res = selected.filter((sel) => sel.id === option.id)
  return res?.length > 0
}

type OptionsGroupData = {
  id: string | number
} & { [key: string]: string }

type OwnProps = {
  optionsTitle: string
  displayKey: string
  options: OptionsGroupData[]
  selected: OptionsGroupData[]
  maxSelected: number
  minSelected: number
  getSelected: (selected: OptionsGroupData[]) => void
}

type Props = OwnProps

const OptionsGroup: FunctionComponent<Props> = ({
  optionsTitle,
  displayKey,
  options,
  selected,
  maxSelected,
  minSelected,
  getSelected,
}) => {
  const [select, setSelect] = useState<OptionsGroupData[]>(selected)

  const handleMods = (mod: any, isSelected: boolean) => {
    let modsArr: OptionsGroupData[] = []

    // if maxSelected and minSelected both are 1, we need to replace in at least one of the scenarios (removing or adding)
    if (select?.length === minSelected && minSelected === 1) {
      if (mod.id === select[0].id) {
        // avoid re-rendering
        return
      }
      modsArr = [mod]
    } else if (isSelected) {
      const selectedModIndex = select.findIndex((m) => m.id === mod.id)
      modsArr = [...select.slice(0, selectedModIndex), ...select.slice(selectedModIndex + 1, select.length)]
    } else if (select?.length < maxSelected) {
      modsArr = [...select, mod]
    } else {
      console.log('remove an option first')
    }
    setSelect(modsArr)
    getSelected(modsArr)
  }

  return (
    <Div flexDir="row" mb={16} justifyContent="flex-start" flexWrap="wrap">
      <Text color={theme.light_1} fontSize={15} fontWeight="bold">
        {optionsTitle}
      </Text>
      {options.map((option, i) => {
        const isSelected = options?.length > 0 && compare(option, select)
        const buttonPreset = isSelected ? ButtonEnum.SELECTED : ButtonEnum.OPTION
        const marginRight = i < options.length ? 8 : 0
        const toggleMods = () => handleMods(option, isSelected)

        return (
          <Div mr={marginRight} key={String(i)}>
            <CustomButton text={option[displayKey]} onPress={toggleMods} preset={buttonPreset} />
          </Div>
        )
      })}
    </Div>
  )
}
export default OptionsGroup
