import { Connection, Repository } from 'typeorm'
import { ExerciseModel } from '../entities/ExerciseModel'
import { WorkoutModel } from '../entities/WorkoutModel'
import { CardioModel } from '../entities/CardioModel'

interface ICreateWorkoutData {
  start?: Date
  end?: Date
  exercises?: Promise<ExerciseModel[]>
  cardios?: Promise<CardioModel[]>
}

export class WorkoutRepository {
  private ormRepository: Repository<WorkoutModel>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(WorkoutModel)
  }

  public async getAll(): Promise<WorkoutModel[]> {
    const workouts = await this.ormRepository.find()

    return workouts
  }

  public async create({
    start,
    end,
    exercises,
    cardios,
  }: ICreateWorkoutData): Promise<WorkoutModel> {
    const workout = this.ormRepository.create({
      start,
      end,
      exercises,
      cardios,
    })

    await this.ormRepository.save(workout)

    return workout
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
