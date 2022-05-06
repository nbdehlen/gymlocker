import { Connection, Repository } from 'typeorm'
import { ExerciseSelectModel } from '../entities/ExerciseSelectModel'
import { ExSelectAssist } from '../entities/ExSelectAssist'
import { MuscleModel } from '../entities/MuscleModel'

export interface ICreateExerciseSelectData {
  exercise: string
  muscles: MuscleModel
  assistingMuscles?: ExSelectAssist[]
  custom: boolean
}

export class ExerciseSelectRepository {
  private ormRepository: Repository<ExerciseSelectModel>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(ExerciseSelectModel)
  }

  public async getAll(relations?: string[]): Promise<ExerciseSelectModel[]> {
    const exercisesSelect = await this.ormRepository.find({ ...(relations && { relations }) })

    return exercisesSelect
  }

  public async create({
    exercise,
    muscles,
    assistingMuscles,
    custom,
  }: ICreateExerciseSelectData): Promise<ExerciseSelectModel> {
    const exerciseSelect = await this.ormRepository.create({
      exercise,
      custom,
      muscles,
      assistingMuscles,
    })

    const res = await this.ormRepository.save(exerciseSelect)

    return res
  }

  public async getExercisesByMuscleId(muscleId: string, relations: string[]): Promise<ExerciseSelectModel[]> {
    const exercises = await this.ormRepository.find({ where: { musclesId: muscleId }, ...(relations && { relations }) })
    return exercises
  }

  public async createMany(exercises: ICreateExerciseSelectData[]): Promise<void> {
    await this.ormRepository.save(exercises)
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
