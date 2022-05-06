import { Connection, In, Not, Repository } from 'typeorm'
import { ExMod } from '../entities/ExMod'

export interface ICreateExModData {
  exerciseId: string
  modifierId: string
}

export class ExModRepository {
  private ormRepository: Repository<ExMod>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(ExMod)
  }

  public async saveMany(exMod: ICreateExModData[]): Promise<ExMod[]> {
    const exerciseModifiers = await this.ormRepository.save(exMod)

    return exerciseModifiers
  }

  public async save(exMod: ExMod): Promise<ExMod> {
    const exerciseModifiers = await this.ormRepository.save(exMod)

    return exerciseModifiers
  }

  public async getAll(): Promise<ExMod[]> {
    const exMod = await this.ormRepository.find()

    return exMod
  }

  public async delete(data: Partial<ExMod>): Promise<void> {
    await this.ormRepository.delete(data)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }

  public async updateExModsForExercise(modifiers: ExMod[] = [], exerciseId: string): Promise<void> {
    const modifierIds = modifiers.map((mod) => mod.modifierId)

    if (modifierIds.length === 0) {
      // When no modifiers were selected, delete all modifiers/ExMods for the exercise
      const modsToBeRemoved = await this.ormRepository.find({ exerciseId })

      if (modsToBeRemoved.length > 0) {
        await this.ormRepository.remove(modsToBeRemoved)
      }
    } else {
      // Mods that are not in the modifiers prop gets deleted
      const modsToBeRemoved = await this.ormRepository.find({
        exerciseId,
        modifierId: Not(In(modifierIds)),
      })

      if (modsToBeRemoved.length > 0) {
        await this.ormRepository.remove(modsToBeRemoved)
      }

      // Create or update mods
      await this.ormRepository.save(modifiers)
    }
  }
}
