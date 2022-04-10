import { Connection } from 'typeorm'
import { NEW_INSTALL, NEW_SEED } from '../storageConstants'
import { getData, storeData } from './asyncStorage'
// import modifiers from '../data/seeding/starter/modifiers/modifiers.json'
import muscles from '../data/seeding/starter/muscles/muscles.json'
import { exerciseSelect } from '../data/seeding/starter/exerciseSelect'
import { In } from 'typeorm'
import { MuscleModel } from '../data/entities/MuscleModel'
// import { ModifierModel } from '../data/entities/ModifierModel'
import { ExerciseSelectModel } from '../data/entities/ExerciseSelectModel'
import { ExSelectAssist } from '../data/entities/ExSelectAssist'

// const seedModifiers = async (connection: Connection) => {
//   const modifierCon = connection.getRepository<ModifierModel>('modifiers')
//   const hasModifiers = await modifierCon.find()
//   // console.log({ hasModifiers })

//   if (hasModifiers.length < 1) {
//     const modifiersWithIds = await modifierCon.create(modifiers.modifiers)
//     await modifierCon.save(modifiersWithIds)
//   }
// }

const seedMuscles = async (connection: Connection) => {
  const musclesCon = connection.getRepository<MuscleModel>('muscles')
  const hasMuscles = await musclesCon.findOne()

  if (hasMuscles instanceof MuscleModel) {
    const musclesWithIds = await musclesCon.create(muscles.muscles)
    await musclesCon.save(musclesWithIds)
  }
}

const seedExerciseSelect = async (connection: Connection) => {
  const musclesCon = connection.getRepository<MuscleModel>('muscles')
  const exSelectCon = connection.getRepository<ExerciseSelectModel>('exerciseselect')
  const exSelectAssistCon = connection.getRepository<ExSelectAssist>('exselectassist')

  const exerciseSelectData = exerciseSelect.map(async (ex) => {
    try {
      // const modifiersData = await connection
      //   .getRepository<ModifierModel>('modifiers')
      //   .find({ where: { modifier: In(ex.modifiers ?? []) } })
      const musclesData = await musclesCon.findOne({ muscle: ex.muscles })

      const exerciseSelectModel = new ExerciseSelectModel()
      exerciseSelectModel.exercise = ex.exercise
      exerciseSelectModel.custom = false
      if (musclesData) {
        exerciseSelectModel.muscles = musclesData
      }

      const saved = await exSelectCon.save(exerciseSelectModel)
      const assistingMusclesIds = await musclesCon.find({ where: { muscle: In(ex.assistingMuscles) } }) // select: ['id'],
      const exSelectAssistIds = assistingMusclesIds.map((ast) => ({
        exerciseSelectId: saved.id,
        muscleId: ast.id,
      }))

      if (exSelectAssistIds.length > 0) {
        const res = await exSelectAssistCon.save(exSelectAssistIds)
        console.log(res)
      }
    } catch (e) {
      console.warn(e)
    }
  })

  await Promise.all(exerciseSelectData)
}

export const seedDatabase = async (connection: Connection) => {
  const hasInstalled = await getData(NEW_INSTALL)
  const seeded = await getData(NEW_SEED)

  // const exSelectCon = connection.getRepository<ExerciseSelectModel>('exerciseselect')
  // const currentExercises = await exSelectCon.find({
  //   relations: ['assistingMuscles', 'muscles'],
  // })
  // console.log(currentExercises.slice(4, 8))

  if (!seeded && hasInstalled && connection) {
    try {
      // await seedModifiers(connection)
      await seedMuscles(connection)
      await seedExerciseSelect(connection)
      storeData(NEW_SEED, String(Date.now()))
    } catch (e) {
      console.log(e)
    }
  }
}
