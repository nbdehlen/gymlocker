import { Connection, Repository } from 'typeorm'
import { SetModel } from '../entities/SetModel'

export interface ICreateSetData {
  weight_kg: number
  repetitions: number
  order: number
  exercise_id?: number
}

export class SetRepository {
  private ormRepository: Repository<SetModel>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(SetModel)
  }

  public async getAll(): Promise<SetModel[]> {
    const setRepository = await this.ormRepository.find()

    return setRepository
  }

  public async create({ weight_kg, repetitions, order, exercise_id }: ICreateSetData): Promise<SetModel> {
    const set = this.ormRepository.create({
      weight_kg,
      repetitions,
      order,
      exercise_id: exercise_id || 0,
    })

    await this.ormRepository.save(set)

    return set
  }

  public async createMany(sets: ICreateSetData[]): Promise<SetModel[]> {
    const data = this.ormRepository.create(sets)

    await this.ormRepository.save(data)

    return data
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
