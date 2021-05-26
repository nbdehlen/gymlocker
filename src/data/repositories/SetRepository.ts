import { Connection, Repository } from 'typeorm'
import { ExerciseModel } from '../entities/ExerciseModel'
import { SetModel } from '../entities/SetModel'

interface ICreateSetData {
  weight: number
  repetitions: number
  unit?: string
  exercise: ExerciseModel
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

  public async create({ weight, repetitions, unit, exercise }: ICreateSetData): Promise<SetModel> {
    const set = this.ormRepository.create({
      weight,
      repetitions,
      unit,
      exercise,
    })

    await this.ormRepository.save(set)

    return set
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id)
  }
}
