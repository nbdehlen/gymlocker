import { Connection, Repository } from 'typeorm'
import { CardioModel } from '../entities/CardioModel'
import { ExerciseModel } from '../entities/ExerciseModel'
import { SetModel } from '../entities/SetModel'
import { WorkoutModel } from '../entities/WorkoutModel'

interface ICreateCardioData {
  start?: Date
  end?: Date
  cardioType?: string
  calories?: number
  meters: number
  workout: WorkoutModel
}

export class CardioRepository {
  private ormRepository: Repository<CardioModel>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(CardioModel)
  }

  public async getAll(): Promise<CardioModel[]> {
    const cardios = await this.ormRepository.find()

    return cardios
  }

  public async create({
    start,
    end,
    cardioType,
    calories,
    meters,
    workout,
  }: ICreateCardioData): Promise<CardioModel> {
    const cardio = this.ormRepository.create({
      start,
      end,
      cardioType,
      calories,
      meters,
      workout,
    })

    await this.ormRepository.save(cardio)

    return cardio
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
