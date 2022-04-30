import { Connection } from 'typeorm'
import { NEW_INSTALL, NEW_SEED } from '../storageConstants'
import { getData, storeData } from './asyncStorage'
import modifiers from '../data/seeding/starter/modifiers/modifiers.json'
import muscles from '../data/seeding/starter/muscles/muscles.json'
import { exerciseSelect } from '../data/seeding/starter/exerciseSelect'
import { In } from 'typeorm'
import { MuscleModel } from '../data/entities/MuscleModel'
import { ModifierModel } from '../data/entities/ModifierModel'
import { ExerciseSelectModel } from '../data/entities/ExerciseSelectModel'
import { ExSelectAssist } from '../data/entities/ExSelectAssist'
// import { WorkoutModel } from '../data/entities/WorkoutModel'

async function seedModifiers(connection: Connection) {
  const modifierCon = connection.getRepository<ModifierModel>('modifiers')
  const hasModifiers = await modifierCon.find()
  console.log({ hasModifiers })

  if (hasModifiers.length < 1) {
    const modifiersWithIds = await modifierCon.create(modifiers.modifiers)
    await modifierCon.save(modifiersWithIds)
  }
}

async function seedMuscles(connection: Connection) {
  const musclesCon = connection.getRepository<MuscleModel>('muscles')
  const hasMuscles = await musclesCon.findOne()

  if (!hasMuscles) {
    const musclesWithIds = await musclesCon.create(muscles.muscles)
    await musclesCon.save(musclesWithIds)
  }
}

async function seedExerciseSelect(connection: Connection) {
  const exSelectCon = connection.getRepository<ExerciseSelectModel>('exerciseselect')
  // assisting muscles
  const musclesCon = connection.getRepository<MuscleModel>('muscles')
  const exSelectAssistCon = connection.getRepository<ExSelectAssist>('exselectassist')
  // modifiers available
  const modifiersCon = connection.getRepository<ModifierModel>('modifiers')
  const exSelectModAvailable = connection.getRepository<ExSelectAssist>('exselectmodavailable')

  // Adding the starter pack of selectable exercises to the database
  const exerciseSelectData = exerciseSelect.map(async (ex) => {
    try {
      const musclesData = await musclesCon.findOne({ muscle: ex.muscles })

      const exerciseSelectModel = new ExerciseSelectModel()
      exerciseSelectModel.exercise = ex.exercise
      exerciseSelectModel.custom = false
      if (musclesData) {
        exerciseSelectModel.muscles = musclesData
      }

      const saved = await exSelectCon.save(exerciseSelectModel)
      // assisting muscles
      const assistingMusclesIds = await musclesCon.find({ where: { muscle: In(ex.assistingMuscles) } }) // select: ['id'],
      const exSelectAssistIds = assistingMusclesIds.map((ast) => ({
        exerciseSelectId: saved.id,
        muscleId: ast.id,
      }))

      if (exSelectAssistIds.length > 0) {
        await exSelectAssistCon.save(exSelectAssistIds)
      }
      // modifiers available for the exercise
      const modsAvailableIds = await modifiersCon.find({ where: { modifier: In(ex.modifiers) } }) // select: ['id'],
      const exSelectModAvailableIds = modsAvailableIds.map((mod) => ({
        exerciseSelectId: saved.id,
        modifierId: mod.id,
      }))

      if (exSelectModAvailableIds.length > 0) {
        await exSelectModAvailable.save(exSelectModAvailableIds)
      }
    } catch (e) {
      console.warn(e)
    }
  })

  await Promise.all(exerciseSelectData)
}

export async function seedDatabase(connection: Connection) {
  const hasInstalled = await getData(NEW_INSTALL)
  const seeded = await getData(NEW_SEED)

  // const workoutCon = connection.getRepository<WorkoutModel>('workouts')
  // const currentWorkouts = await workoutCon.find({
  // relations: [
  // 'cardios',
  // 'exercises',
  // 'exercises.sets',
  // 'exercises.muscles',
  // 'exercises.modifiers',
  // 'exercises.modifiers.modifier',
  // 'exercises.assistingMuscles',
  // 'exercises.assistingMuscles.assistingMuscle',
  // ],
  // })
  // console.log(currentWorkouts)

  if (!seeded && hasInstalled && connection) {
    try {
      await seedModifiers(connection)
      await seedMuscles(connection)
      await seedExerciseSelect(connection)
      storeData(NEW_SEED, String(Date.now()))
    } catch (e) {
      console.log(e)
    }
  }
}
