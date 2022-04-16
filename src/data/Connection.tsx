import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Connection, createConnection } from 'typeorm'
import { CardioModel } from './entities/CardioModel'
import { ExerciseModel } from './entities/ExerciseModel'
import { ExerciseSelectModel } from './entities/ExerciseSelectModel'
import { SetModel } from './entities/SetModel'
import { WorkoutModel } from './entities/WorkoutModel'
import { CardioRepository } from './repositories/CardioRepository'
import { ExerciseRepository } from './repositories/ExerciseRepository'
import { ExerciseSelectRepository } from './repositories/ExerciseSelectRepository'
import { SetRepository } from './repositories/SetRepository'
import { WorkoutRepository } from './repositories/WorkoutRepository'
import { migrations } from '../data/migrations'
import { getData } from '../utils/asyncStorage'
import { NEW_INSTALL } from '../storageConstants'
import { seedDatabase } from '../utils/seedDatabase'
import { MuscleModel } from './entities/MuscleModel'
// import { ModifierModel } from './entities/ModifierModel'
import { MuscleRepository } from './repositories/MuscleRepository'
import { ExSelectAssistRepository } from './repositories/ExSelectAssistRepository'
import { ExSelectAssist } from './entities/ExSelectAssist'
import theme from '../utils/theme'
import { ExAssistRepository } from './repositories/ExAssistRepository'
import { ExAssist } from './entities/ExAssist'
// import { ModifierRepository } from './repositories/ModifierRepository'

interface DatabaseConnectionContextData {
  muscleRepository: MuscleRepository
  // modifierRepository: ModifierRepository
  workoutRepository: WorkoutRepository
  exerciseSelectRepository: ExerciseSelectRepository
  exerciseRepository: ExerciseRepository
  setRepository: SetRepository
  cardioRepository: CardioRepository
  exSelectAssistRepository: ExSelectAssistRepository
  exAssistRepository: ExAssistRepository
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>({} as DatabaseConnectionContextData)

export const DatabaseConnectionProvider: React.FC = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null)

  const connect = useCallback(async () => {
    const installDate = await getData(NEW_INSTALL)
    const createdConnection = await createConnection({
      type: 'expo',
      database: '@workout.db',
      driver: require('expo-sqlite'),
      entities: [
        MuscleModel,
        WorkoutModel,
        ExerciseSelectModel,
        ExerciseModel,
        CardioModel,
        SetModel,
        ExSelectAssist,
        ExAssist,
      ], // ModifierModel
      migrations,
      // dropSchema: true,
      migrationsRun: !installDate,
      logging: __DEV__,
    })

    setConnection(createdConnection)
  }, [])

  useEffect(() => {
    if (!connection) {
      connect()
    } else {
      seedDatabase(connection)
    }
  }, [connect, connection])

  if (!connection) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.primary.onColor} size="large" />
      </View>
    )
  }

  return (
    <DatabaseConnectionContext.Provider
      value={{
        muscleRepository: new MuscleRepository(connection),
        // modifierRepository: new ModifierRepository(connection),
        workoutRepository: new WorkoutRepository(connection),
        exerciseSelectRepository: new ExerciseSelectRepository(connection),
        exerciseRepository: new ExerciseRepository(connection),
        setRepository: new SetRepository(connection),
        cardioRepository: new CardioRepository(connection),
        exSelectAssistRepository: new ExSelectAssistRepository(connection),
        exAssistRepository: new ExAssistRepository(connection),
      }}
    >
      {children}
    </DatabaseConnectionContext.Provider>
  )
}

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext)

  return context
}
