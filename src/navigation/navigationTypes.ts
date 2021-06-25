import { WorkoutModel } from '../data/entities/WorkoutModel'
import { ScreenRoute, StackRoute, TabRoute } from './NAV_CONSTANTS'

export type PlantParamList = {
  [ScreenRoute.WORKOUT_EDIT]: { workout: WorkoutModel }
}
