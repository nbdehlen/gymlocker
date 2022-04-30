import { Connection, Repository } from 'typeorm'
import { ExSelectAssist } from '../entities/ExSelectAssist'

export class ExSelectAssistRepository {
  private ormRepository: Repository<ExSelectAssist>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(ExSelectAssist)
  }

  public async getAll(): Promise<ExSelectAssist[]> {
    const exSelectAssist = await this.ormRepository.find()

    return exSelectAssist
  }

  public async delete(data: Partial<ExSelectAssist>): Promise<void> {
    await this.ormRepository.delete(data)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
