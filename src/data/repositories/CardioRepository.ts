import { Connection, Repository } from 'typeorm'
import { CardioModel } from '../entities/CardioModel'

export interface ICreateCardioData {
  id?: string
  cardioType?: string
  duration_minutes: number
  calories?: number
  distance_m: number
  order: number
  workout_id?: string
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

  public async createMany(cardios: ICreateCardioData[]): Promise<CardioModel[]> {
    const data = this.ormRepository.create(cardios)

    await this.ormRepository.save(data)

    return data
  }

  public async tableColumns(): Promise<CardioModel[]> {
    // const metadata = await this.ormRepository.metadata
    const cardios = await this.ormRepository.query('DESC cardios')
    console.log('____________________________________', cardios, '____________________________________')
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

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
