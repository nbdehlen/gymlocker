import { Connection, Repository } from 'typeorm'
import { ExerciseSelectModel } from '../entities/ExerciseSelectModel'

interface ICreateExerciseSelectData {
  exercise: string
  muscles: string
  assistingMuscles?: string
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
    muscles,
    assistingMuscles,
    custom
  }: ICreateExerciseSelectData): Promise<ExerciseSelectModel> {
    const exerciseSelect = this.ormRepository.create({
      exercise,
      muscles,
      assistingMuscles,
      custom
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

  public async getExercisesByMuscle(muscle: string): Promise<ExerciseSelectModel[]> {
    const exercises = await this.ormRepository.find({ where: { muscles: muscle } })
    return exercises
  }

  public async createMany(exercises: ICreateExerciseSelectData[]): Promise<void> {
    await this.ormRepository.save(exercises)
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
