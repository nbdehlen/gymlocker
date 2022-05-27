import React, { FunctionComponent, useState } from 'react'
import { Div, Text } from 'react-native-magnus'
import { ExMod } from '../data/entities/ExMod'
import { ExSelectModAvailable } from '../data/entities/ExSelectModAvailable'
import { ModifierModel } from '../data/entities/ModifierModel'
import theme from '../utils/theme'
import CustomButton, { ButtonEnum } from './CustomButton'

const compare = (modifiersSelected: Array<ModifierModel>, modAvailable: ModifierModel): boolean => {
  const res = modifiersSelected.filter((mod) => mod.id === modAvailable.id)
  return res?.length > 0
}

type OwnProps = {
  modifiers: ExMod[]
  modifiersAvailable: ExSelectModAvailable[]
  addModsToExercise: (exerciseIndex: number, modifiers: ExMod[]) => void
  exerciseIndex: number
  exerciseId: string
}

type Props = OwnProps

const ButtonGroup: FunctionComponent<Props> = ({
  modifiersAvailable,
  modifiers,
  addModsToExercise,
  exerciseIndex,
  exerciseId,
}) => {
  const modProps = modifiers.map((mod) => mod.modifier!)
  const [mods, setMods] = useState<ModifierModel[]>(modProps)

  const handleMods = (mod: ModifierModel, isSelected: boolean) => {
    let modsArr: ModifierModel[]
    if (isSelected) {
      const selectedModIndex = mods.findIndex((m) => m.id === mod.id)
      modsArr = [...mods.slice(0, selectedModIndex), ...mods.slice(selectedModIndex + 1, mods.length)]
    } else {
      modsArr = [...mods, mod]
    }
    const modsToExMods = modsArr.map((m): ExMod => ({ exerciseId, modifier: m, modifierId: m.id }))
    setMods(modsArr)
    addModsToExercise(exerciseIndex, modsToExMods)
  }

  return (
    <Div flexDir="row" mb={16} justifyContent="flex-start" flexWrap="wrap">
      <Text color={theme.light_1} fontSize={15} fontWeight="bold">
        Options:
      </Text>
      {modifiersAvailable.map((mod, i) => {
        const isSelected = modifiers?.length > 0 && compare(mods, mod.modifier)
        const buttonPreset = isSelected ? ButtonEnum.SELECTED : ButtonEnum.OPTION
        const marginRight = i < modifiersAvailable.length ? 8 : 0
        const toggleMods = () => handleMods(mod.modifier, isSelected)

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
