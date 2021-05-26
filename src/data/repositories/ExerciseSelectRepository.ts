import { Connection, Repository } from 'typeorm'
import { ExerciseSelectModel } from '../entities/ExerciseSelectModel'

interface ICreateExerciseSelectData {
  exercise: string
  displayName: string
  muscles: string
  assistingMuscles?: string
  tool?: string
  custom?: boolean
}

export class ExerciseSelectRepository {
  private ormRepository: Repository<ExerciseSelectModel>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(ExerciseSelectModel)
  }

  public async getAll(): Promise<ExerciseSelectModel[]> {
    const exercisesSelect = await this.ormRepository.find()

    return exercisesSelect
  }

  public async create({
    exercise,
    displayName,
    muscles,
    assistingMuscles,
    tool,
    custom,
  }: ICreateExerciseSelectData): Promise<ExerciseSelectModel> {
    const exerciseSelect = this.ormRepository.create({
      exercise,
      displayName,
      muscles,
      assistingMuscles,
      tool,
      custom,
    })

    await this.ormRepository.save(exerciseSelect)

    return exerciseSelect
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
