import { Connection, Repository } from 'typeorm'
import { ExerciseModel } from '../entities/ExerciseModel'

interface ICreateExerciseData {
  exercise: string
  muscles: string
  assistingMuscles?: string
  order: number
  workout_id?: number
}

export class ExerciseRepository {
  private ormRepository: Repository<ExerciseModel>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(ExerciseModel)
  }

  public async getAll(): Promise<ExerciseModel[]> {
    const exercises = await this.ormRepository.find()

    return exercises
  }

  public async getById(id: number, relations?: string[]): Promise<ExerciseModel[]> {
    return await this.ormRepository.find({
      where: { id },
      ...(relations && { relations }),
    })
  }

  public async exerciseIdExists(id: number): Promise<boolean> {
    const exercise = await this.ormRepository.find({ where: { id } })
    if (exercise) {
      console.log(exercise)
      return true
    }
    return false
  }

  public async create({
    exercise,
    muscles,
    assistingMuscles,
    order,
    workout_id,
  }: ICreateExerciseData): Promise<ExerciseModel> {
    const data = this.ormRepository.create({
      exercise,
      muscles,
      assistingMuscles,
      order,
      workout_id,
    })

    await this.ormRepository.save(data)

    return data
  }

  public async createMany(exercises: ICreateExerciseData[]): Promise<ExerciseModel[]> {
    const data = this.ormRepository.create(exercises)

    await this.ormRepository.save(data)

    return data
  }

  //   public async toggle(id: number): Promise<void> {
  //     await this.ormRepository.query(
  //       `
  //       UPDATE
  //         todos
  //       SET
  //         is_toggled = ((is_toggled | 1) - (is_toggled & 1))
  //       WHERE
  //         id = ?;
  //       `,
  //       [id]
  //     )
  //   }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
