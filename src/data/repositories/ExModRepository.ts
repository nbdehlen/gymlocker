import { Connection, Repository } from 'typeorm'
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
}
