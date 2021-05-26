import { Connection, Repository } from 'typeorm'
import { ExerciseModel } from '../entities/ExerciseModel'
import { SetModel } from '../entities/SetModel'
import { WorkoutModel } from '../entities/WorkoutModel'

interface ICreateExerciseData {
  exercise: string
  displayName?: string
  muscles: string
  assistingMuscles?: string
  tool?: string
  start?: string
  sets?: Promise<SetModel[]>
  workout?: WorkoutModel
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
    displayName,
    muscles,
    assistingMuscles,
    tool,
    start,
    sets,
    workout,
  }: ICreateExerciseData): Promise<ExerciseModel> {
    const exercisee = this.ormRepository.create({
      exercise,
      displayName,
      muscles,
      assistingMuscles,
      tool,
      start,
      sets,
      workout,
    })

    await this.ormRepository.save(exercisee)

    return exercisee
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
