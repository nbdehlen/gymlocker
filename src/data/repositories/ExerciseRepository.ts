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

  public async create({
    exercise,
    muscles,
    assistingMuscles,
    order,
    workout_id,
  }: ICreateExerciseData): Promise<ExerciseModel> {
    const exercisee = this.ormRepository.create({
      exercise,
      muscles,
      assistingMuscles,
      order,
      workout_id,
    })

    await this.ormRepository.save(exercisee)

    return exercisee
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
}
