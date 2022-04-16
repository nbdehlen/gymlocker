import { Connection, Repository } from 'typeorm'
import { ExAssist } from '../entities/ExAssist'

export interface ICreateExAssistData {
  muscleId: number
  exerciseId: number
}

export class ExAssistRepository {
  private ormRepository: Repository<ExAssist>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(ExAssist)
  }

  public async saveMany(exAssists: ICreateExAssistData[]): Promise<ExAssist[]> {
    const exerciseAssist = await this.ormRepository.save(exAssists)

    return exerciseAssist
  }

  public async save(exAssist: ICreateExAssistData): Promise<ExAssist> {
    const exerciseAssist = await this.ormRepository.save(exAssist)

    return exerciseAssist
  }

  public async getAll(): Promise<ExAssist[]> {
    const exerciseAssist = await this.ormRepository.find()

    return exerciseAssist
  }

  public async delete(data: Partial<ExAssist>): Promise<void> {
    await this.ormRepository.delete(data)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
