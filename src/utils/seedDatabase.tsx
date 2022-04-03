import { Connection } from 'typeorm'
import exercisesSelect from '../data/seeding/starter/exercisesSelect'
import { NEW_INSTALL, NEW_SEED } from '../storageConstants'
import { getData, storeData } from './asyncStorage'

export const seedDatabase = (connection: Connection) => {
  const checkSeeding = async () => {
    const hasInstalled = await getData(NEW_INSTALL)
    const seeded = await getData(NEW_SEED)

    if (!seeded && hasInstalled && connection) {
      await connection.getRepository('exercisesselect').insert(exercisesSelect)
      storeData(NEW_SEED, String(Date.now()))
    }
  }
  checkSeeding()
}
