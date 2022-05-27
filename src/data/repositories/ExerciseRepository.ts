import { Connection, DeepPartial, Repository, SelectQueryBuilder } from 'typeorm'
import { ExerciseModel } from '../entities/ExerciseModel'
import { ExMod } from '../entities/ExMod'
import { SetModel } from '../entities/SetModel'
import { ICreateSetData } from './SetRepository'

export interface ICreateExerciseData {
  id?: string
  exercise: string
  order: number
  workout_id?: string
  sets?: Array<SetModel | ICreateSetData> // TODO: Not sure this is viable
  modifiers?: ExMod[]
}

export interface MusclesCount {
  count: number
  muscles_id: string
  muscles_muscle: string
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
    order,
    workout_id,
    modifiers,
    sets,
  }: ICreateExerciseData): Promise<ExerciseModel> {
    const data = this.ormRepository.create({
      ...(id && { id }),
      exercise,
      order,
      workout_id,
      ...(modifiers && { modifiers }),
      ...(sets && { sets }),
    })

    await this.ormRepository.save(data)

    return data
  }

  public async createOrUpdate(exerciseData: DeepPartial<ExerciseModel>): Promise<ExerciseModel> {
    const res = await this.ormRepository.save(exerciseData)
    return res
  }

  public async createMany(exercises: ExerciseModel[]): Promise<ExerciseModel[]> {
    const res = await this.ormRepository.save(exercises)

    return res
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }

  public async getMuscleCounts(from: string): Promise<MusclesCount[]> {
    const res = await this.ormRepository
      .createQueryBuilder('exercise')
      .select('exercise.exerciseSelectId AS select_id')
      .leftJoinAndSelect('exercise.exerciseSelect', 'exercise_select')
      .leftJoinAndSelect('exercise_select.muscles', 'muscles')
      .leftJoinAndSelect('exercise.workout', 'workout')
      .select('muscles.muscle')
      .addSelect('workout.start')
      .where('workout.start >= :from', { from })
      .addSelect('COUNT(*) AS count')
      .groupBy('exercise_select.muscles')
      .orderBy('count', 'ASC')
      .getRawMany()

    return res
  }

  public queryBuilder(initialColumn: string): SelectQueryBuilder<any> {
    return this.ormRepository.createQueryBuilder().select(initialColumn)
  }
}
