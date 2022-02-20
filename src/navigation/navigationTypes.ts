import { WorkoutModel } from '../data/entities/WorkoutModel'
import { DrawerRoute, ScreenRoute, StackRoute, TabRoute } from './NAV_CONSTANTS'

export type WorkoutParamList = {
  [DrawerRoute.GYM_DRAWER]: { workout: WorkoutModel }
  [ScreenRoute.WORKOUT_EDIT]: { workout: WorkoutModel }
  [ScreenRoute.WORKOUT_DETAILS]: { workout: WorkoutModel }
  [ScreenRoute.WORKOUT_ADD]: undefined
  [ScreenRoute.CALENDAR]: undefined
}
