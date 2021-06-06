import { Connection, Repository } from 'typeorm'
import { CardioModel } from '../entities/CardioModel'
import { WorkoutModel } from '../entities/WorkoutModel'

interface ICreateCardioData {
  cardioType?: string
  duration_minutes: number
  calories?: number
  distance_m: number
  order: number
  workout_id?: number
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

  public async tableColumns(): Promise<CardioModel[]> {
    // const metadata = await this.ormRepository.metadata
    const cardios = await this.ormRepository.query(`DESC cardios`)
    console.log(
      '____________________________________',
      cardios,
      '____________________________________'
    )
    return cardios
  }

  public async create({
    cardioType,
    duration_minutes,
    calories,
    distance_m,
    order,
    workout_id,
  }: ICreateCardioData): Promise<CardioModel> {
    const cardio = this.ormRepository.create({
      cardioType,
      duration_minutes,
      calories,
      distance_m,
      order,
      workout_id,
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

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
