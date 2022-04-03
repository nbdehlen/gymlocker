import { Connection, DeepPartial, Repository } from 'typeorm'
import { ExerciseModel } from '../entities/ExerciseModel'
import { SetModel } from '../entities/SetModel'
import { ICreateSetData } from './SetRepository'

export interface ICreateExerciseData {
  exercise: string
  muscles: string
  assistingMuscles?: string
  order: number
  workout_id?: number
  sets?: Array<SetModel | ICreateSetData> // TODO: Not sure this is viable
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
    sets,
  }: ICreateExerciseData): Promise<ExerciseModel> {
    const data = this.ormRepository.create({
      exercise,
      muscles,
      assistingMuscles,
      order,
      workout_id,
      sets,
    })

    await this.ormRepository.save(data)

    return data
  }

  // Using Math.random() as id on frontend for exercises that haven't been
  // created yet. A unique identifier is required for react keys.
  // Yes, it might not have been a good idea ;-)
  public async createOrUpdate(exerciseData: DeepPartial<ExerciseModel>): Promise<ExerciseModel> {
    let exercise = exerciseData

    if (!Number.isInteger(exerciseData.id)) {
      delete exercise.id
      exercise = await this.ormRepository.create(exercise)
    }
    const result = await this.ormRepository.save(exercise)

    return result
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
