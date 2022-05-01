import { Connection, DeepPartial, Repository } from 'typeorm'
import { ExAssist } from '../entities/ExAssist'
import { ExerciseModel } from '../entities/ExerciseModel'
import { ExMod } from '../entities/ExMod'
import { MuscleModel } from '../entities/MuscleModel'
import { SetModel } from '../entities/SetModel'
import { ICreateSetData } from './SetRepository'

export interface ICreateExerciseData {
  id?: string
  exercise: string
  order: number
  workout_id?: string
  sets?: Array<SetModel | ICreateSetData> // TODO: Not sure this is viable
  muscles: MuscleModel
  assistingMuscles?: ExAssist[]
  modifiers?: ExMod[]
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

  public async getById(id: string, relations?: string[]): Promise<ExerciseModel[]> {
    return await this.ormRepository.find({
      where: { id },
      ...(relations && { relations }),
    })
  }

  public async exerciseIdExists(id: string): Promise<boolean> {
    const exercise = await this.ormRepository.find({ where: { id } })
    if (exercise) {
      console.log(exercise)
      return true
    }
    return false
  }

  public async create({
    id,
    exercise,
    muscles,
    order,
    workout_id,
    assistingMuscles,
    modifiers,
    sets,
  }: ICreateExerciseData): Promise<ExerciseModel> {
    const data = this.ormRepository.create({
      ...(id && { id }),
      exercise,
      muscles,
      order,
      workout_id,
      ...(assistingMuscles && { assistingMuscles }),
      ...(modifiers && { modifiers }),
      ...(sets && { sets }),
    })

    await this.ormRepository.save(data)

    return data
  }

  // Using Math.random() as id on frontend for exercises that haven't been
  // created yet. A unique identifier is required for react keys.
  // Yes, it might not have been a good idea ;-)
  public async createOrUpdate(exerciseData: DeepPartial<ExerciseModel>): Promise<ExerciseModel> {
    const res = await this.ormRepository.save(exerciseData)
    return res
  }

  public async createMany(exercises: ICreateExerciseData[]): Promise<ExerciseModel[]> {
    const res = await this.ormRepository.save(exercises)

    return res
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
