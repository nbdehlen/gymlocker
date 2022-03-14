import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Div, Text } from 'react-native-magnus'
import { useDatabaseConnection } from '../../data/Connection'
import exercisesSelect from '../../data/seeding/starter/exercisesSelect'
import { NEW_INSTALL } from '../../storageConstants'
import { getData } from '../../utils/asyncStorage'

type OwnProps = {}

type Props = OwnProps

export const ChartsScreen: FunctionComponent<Props> = () => {
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
  return (
    <Div>
      <Text>DAFDF</Text>
    </Div>
  )
}

export default ChartsScreen
