import { endOfDay, startOfDay } from 'date-fns'
import { Between, Connection, DeepPartial, In, Repository } from 'typeorm'
import { WorkoutModel } from '../entities/WorkoutModel'
import { ICreateCardioData } from './CardioRepository'
import { ICreateExerciseData } from './ExerciseRepository'

export type ICreateWorkoutData = {
  start?: Date
  end?: Date
  exercises?: Promise<ICreateExerciseData[]>
  cardios?: Promise<ICreateCardioData[]>
}

// TODO: Sort by order: exercises and cardio. Order as joint FK for them and one for set?

export class WorkoutRepository {
  private ormRepository: Repository<WorkoutModel>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(WorkoutModel)
  }

  public async getAll(relations?: string[]): Promise<WorkoutModel[]> {
    return await this.ormRepository.find({
      ...(relations && { relations }),
    })
  }

  // TODO: Pagination
  public async getBatch(from: number = 0, limit = 10, relations?: string[]): Promise<WorkoutModel[]> {
    return await this.ormRepository.find({
      ...(relations && { relations }),
    })
  }

  public async getById(id: string, relations?: string[]): Promise<WorkoutModel[]> {
    return await this.ormRepository.find({
      where: { id },
      ...(relations && { relations }),
    })
  }

  public async workoutIdExists(id: string): Promise<boolean> {
    const workout = await this.ormRepository.find({ where: { id } })
    if (workout) {
      console.log(workout)
      return true
    }
    return false
  }

  public async getManyById(ids: string[], relations?: string[]): Promise<WorkoutModel[]> {
    const workouts = await this.ormRepository.find({
      where: { id: In(ids) },
      ...(relations && { relations }),
    })

    return workouts
  }

  public async getBetweenDates(start: string, end: string, relations?: string[]): Promise<WorkoutModel[]> {
    const where = {
      start: Between(startOfDay(new Date(start)).toISOString(), endOfDay(new Date(end)).toISOString()),
    }

    return await this.ormRepository.find({
      where,
      ...(relations && { relations }),
    })
  }

  public async createOrUpdate(workoutData: DeepPartial<WorkoutModel>): Promise<WorkoutModel> {
    const res = await this.ormRepository.save(workoutData)
    return res
  }

  public async create(workoutData: DeepPartial<WorkoutModel>): Promise<WorkoutModel> {
    const workout = this.ormRepository.create(workoutData)
    await this.ormRepository.save(workout)
    return workout
  }

  public async createMany(workouts: DeepPartial<WorkoutModel>[]): Promise<WorkoutModel[]> {
    const data = await this.ormRepository.save(workouts)
    return data
  }

  public async save(workoutData: DeepPartial<WorkoutModel>): Promise<WorkoutModel> {
    const workout = await this.ormRepository.save(workoutData)
    console.log(JSON.stringify(workout, null, 2), 'SAVED WORKOUT')
    return workout
  }

  public async saveMany(workoutData: DeepPartial<WorkoutModel>[]): Promise<WorkoutModel[]> {
    const workouts = await this.ormRepository.save(workoutData)
    return workouts
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
