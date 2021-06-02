import { CreateExercisesSelectTable1621964884049 } from './1621964884049-CreateExercisesSelectTable'
import { CreateWorkoutTable1622070129180 } from './1622070129180-CreateWorkoutsTable'
import { CreateExerciseTable1622070137142 } from './1622070137142-CreateExercisesTable'
import { CreateCardiosTable1622070166549 } from './1622070166549-CreateCardiosTable'
import { CreateSetsTable1622070173991 } from './1622070173991-CreateSetsTable'
import { CreateWorkoutToExerciseFK1622328667572 } from './1622328667572-CreateWorkoutToExerciseFK'
import { CreateWorkoutToCardioFK1622328685466 } from './1622328685466-CreateWorkoutToCardioFK'
import { CreateExerciseToSetFK1622328699766 } from './1622328699766-CreateExerciseToSetFK'
import { SeedExercisesSelect1622339639048 } from './1622339639048-SeedExercisesSelect'

export const migrations = [
  CreateExercisesSelectTable1621964884049,
  CreateWorkoutTable1622070129180,
  CreateCardiosTable1622070166549,
  CreateExerciseTable1622070137142,
  CreateSetsTable1622070173991,
  CreateWorkoutToCardioFK1622328685466,
  CreateWorkoutToExerciseFK1622328667572,
  CreateExerciseToSetFK1622328699766,
  SeedExercisesSelect1622339639048,
]