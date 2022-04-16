import { Connection, In, Repository } from 'typeorm'
import { MuscleModel } from '../entities/MuscleModel'

export interface ICreateMuscleData {
  muscle: string
}

export class MuscleRepository {
  private ormRepository: Repository<MuscleModel>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(MuscleModel)
  }

  public async getAll(): Promise<MuscleModel[]> {
    const muscles = await this.ormRepository.find()

    return muscles
  }

  public async getById(id: number): Promise<MuscleModel[]> {
    return await this.ormRepository.find({
      where: { id },
    })
  }

  public async getByNames(names: string[]): Promise<MuscleModel[]> {
    return await this.ormRepository.find({
      where: { muscle: In(names) },
    })
  }

  public async muscleIdExists(id: number): Promise<boolean> {
    const muscle = await this.ormRepository.find({ where: { id } })
    if (muscle) {
      console.log(muscle)
      return true
    }
    return false
  }

  public async create({ muscle }: ICreateMuscleData): Promise<MuscleModel> {
    const data = this.ormRepository.create({
      muscle,
    })

    await this.ormRepository.save(data)

    return data
  }

  public async createMany(exercises: ICreateMuscleData[]): Promise<MuscleModel[]> {
    const data = this.ormRepository.create(exercises)

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
