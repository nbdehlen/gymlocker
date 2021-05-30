import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
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

interface DatabaseConnectionContextData {
  workoutRepository: WorkoutRepository
  exerciseSelectRepository: ExerciseSelectRepository
  exerciseRepository: ExerciseRepository
  setRepository: SetRepository
  cardioRepository: CardioRepository
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData
)

export const DatabaseConnectionProvider: React.FC = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null)

  const connect = useCallback(async () => {
    const createdConnection = await createConnection({
      type: 'expo',
      database: '@workouts.db',
      driver: require('expo-sqlite'),
      entities: [ExerciseSelectModel, WorkoutModel, ExerciseModel, CardioModel, SetModel],
      migrations,
      migrationsRun: true,
      synchronize: false,
      // cli: {
      //   migrationsDir: 'src/migrations',
      // },
      // dropSchema: true,
    })

    setConnection(createdConnection)
  }, [])

  useEffect(() => {
    if (!connection) {
      connect()
    }
  }, [connect, connection])

  if (!connection) {
    return <ActivityIndicator />
  }

  return (
    <DatabaseConnectionContext.Provider
      value={{
        workoutRepository: new WorkoutRepository(connection),
        exerciseSelectRepository: new ExerciseSelectRepository(connection),
        exerciseRepository: new ExerciseRepository(connection),
        setRepository: new SetRepository(connection),
        cardioRepository: new CardioRepository(connection),
      }}>
      {children}
    </DatabaseConnectionContext.Provider>
  )
}

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext)

  return context
}
