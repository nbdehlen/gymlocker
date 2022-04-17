import { Connection, Repository } from 'typeorm'
import { ExSelectModAvailable } from '../entities/ExSelectModAvailable'

export class ExSelectModAvailableRepository {
  private ormRepository: Repository<ExSelectModAvailable>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(ExSelectModAvailable)
  }

  public async getAll(): Promise<ExSelectModAvailable[]> {
    const exSelectModAvailable = await this.ormRepository.find()

    return exSelectModAvailable
  }

  public async delete(data: Partial<ExSelectModAvailable>): Promise<void> {
    await this.ormRepository.delete(data)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
