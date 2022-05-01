import { Connection, DeepPartial, Repository } from 'typeorm'
import { SetModel } from '../entities/SetModel'

export interface ICreateSetData {
  id?: string
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

  public async create({ id, weight_kg, repetitions, rir, order, exerciseId }: ICreateSetData): Promise<SetModel> {
    const set = this.ormRepository.create({
      ...(id && { id }),
      weight_kg,
      repetitions,
      rir,
      order,
      exerciseId,
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

  public async createOrUpdate(setData: DeepPartial<SetModel>): Promise<SetModel> {
    const res = await this.ormRepository.save(setData)
    return res
  }
}
