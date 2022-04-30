import { Connection, DeepPartial, Repository } from 'typeorm'
import { SetModel } from '../entities/SetModel'

export interface ICreateSetData {
  weight_kg: number
  repetitions: number
  rir: number
  order: number
  exerciseId?: string
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

  public async create({ weight_kg, repetitions, order, exerciseId }: ICreateSetData): Promise<SetModel> {
    const set = this.ormRepository.create({
      weight_kg,
      repetitions,
      rir,
      order,
      exerciseId: exerciseId || 0,
    })

    await this.ormRepository.save(set)

    return set
  }

  public async createMany(sets: ICreateSetData[]): Promise<SetModel[]> {
    const data = await this.ormRepository.save(sets)
    return data
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }

  // Using Math.random() as id on frontend for sets that haven't been
  // created yet. A unique identifier is required for react keys.
  // Yes, it might not have been a good idea ;-)
  public async createOrUpdate(setData: DeepPartial<SetModel>): Promise<SetModel> {
    let set = setData

    if (!Number.isInteger(setData.id)) {
      delete set.id
      set = await this.ormRepository.create(set)
    }
    const res = await this.ormRepository.save(set)

    return res
  }
}
