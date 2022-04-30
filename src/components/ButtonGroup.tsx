import React, { FunctionComponent, useState } from 'react'
import { Div, Text } from 'react-native-magnus'
import { ExMod } from '../data/entities/ExMod'
import { ExSelectModAvailable } from '../data/entities/ExSelectModAvailable'
import { ModifierModel } from '../data/entities/ModifierModel'
import theme from '../utils/theme'
import CustomButton, { ButtonEnum } from './CustomButton'

const compare = (modifiersSelected: Array<ExMod | ExSelectModAvailable>, modAvailable: ModifierModel) => {
  const res = modifiersSelected.filter((mod) => mod.modifier.id === modAvailable.id)
  return res?.length > 0
}

type OwnProps = {
  modifiers: ExMod[]
  modifiersAvailable: ExSelectModAvailable[]
  modifiersRef?: any
}

type Props = OwnProps

const ButtonGroup: FunctionComponent<Props> = ({ modifiersAvailable, modifiers, modifiersRef }) => {
  const [mods, setMods] = useState<Array<ExMod | ExSelectModAvailable>>(modifiers ?? [])

  const handleMods = (mod: ExSelectModAvailable, isSelected: boolean) => {
    if (isSelected) {
      setMods((prevMod) => [
        ...prevMod.slice(0, prevMod.indexOf(mod)),
        ...prevMod.slice(prevMod.indexOf(mod) + 1, prevMod.length),
      ])
    } else {
      setMods((prevMod) => [...prevMod, mod])
    }
    // modifiersRef?.current = mods
  }

  return (
    <Div flexDir="row" mb={16} justifyContent="flex-start">
      <Text color={theme.light_1} fontSize={15} fontWeight="bold">
        Options:
      </Text>
      {modifiersAvailable.map((mod, i) => {
        const isSelected = mods?.length > 0 && compare(mods, mod.modifier)
        const buttonPreset = isSelected ? ButtonEnum.SELECTED : ButtonEnum.OPTION
        const marginRight = i < modifiersAvailable.length ? 8 : 0
        const toggleMods = () => handleMods(mod, isSelected)

        return (
          <Div mr={marginRight} key={mod.modifier.id}>
            <CustomButton text={mod.modifier.modifier} onPress={toggleMods} preset={buttonPreset} />
          </Div>
        )
      })}
    </Div>
  )
}
export default ButtonGroup
