import { endOfDay, isSameDay, startOfDay } from 'date-fns'
import { Between, Connection, Repository } from 'typeorm'
import { WorkoutModel } from '../entities/WorkoutModel'

interface ICreateWorkoutData {
  start?: Date
  end?: Date
  // exercises?: Promise<ExerciseModel[]>
  // cardios?: Promise<CardioModel[]>
}

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
  public async getBatch(
    from: number = 0,
    limit = 10,
    relations?: string[]
  ): Promise<WorkoutModel[]> {
    return await this.ormRepository.find({
      ...(relations && { relations }),
    })
  }

  public async getById(id: number, relations?: string[]): Promise<WorkoutModel[]> {
    return await this.ormRepository.find({
      where: { id },
      ...(relations && { relations }),
    })
  }

  public async getBetweenDates(
    start: string,
    end: string,
    relations?: string[]
  ): Promise<WorkoutModel[]> {
    console.log(
      Between(startOfDay(new Date(start)).toISOString(), endOfDay(new Date(end)).toISOString())
    )

    const where = {
      start: Between(
        startOfDay(new Date(start)).toISOString(),
        endOfDay(new Date(end)).toISOString()
      ),
    }
    // console.log('WHERE', where)

    return await this.ormRepository.find({
      where,
      ...(relations && { relations }),
    })
  }

  public async create({ start, end }: ICreateWorkoutData): Promise<WorkoutModel> {
    const workout = this.ormRepository.create({ start, end })
    await this.ormRepository.save(workout)
    return workout
  }

  public async createMany(workouts: ICreateWorkoutData[]): Promise<WorkoutModel[]> {
    const data = this.ormRepository.create(workouts)
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
