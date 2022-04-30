import { Connection, In, Repository } from 'typeorm'
import { ModifierModel } from '../entities/ModifierModel'

export interface ICreateModifierData {
  modifier: string
}

export class ModifierRepository {
  private ormRepository: Repository<ModifierModel>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(ModifierModel)
  }

  public async getAll(): Promise<ModifierModel[]> {
    const modifiers = await this.ormRepository.find()

    return modifiers
  }

  public async getById(id: number): Promise<ModifierModel[]> {
    return await this.ormRepository.find({
      where: { id },
    })
  }

  public async getByNames(names: string[]): Promise<ModifierModel[]> {
    return await this.ormRepository.find({
      where: { modifier: In(names) },
    })
  }

  public async modifierIdExists(id: number): Promise<boolean> {
    const modifier = await this.ormRepository.find({ where: { id } })
    if (modifier) {
      console.log(modifier)
      return true
    }
    return false
  }

  public async create({ modifier }: ICreateModifierData): Promise<ModifierModel> {
    const data = this.ormRepository.create({
      modifier,
    })

    await this.ormRepository.save(data)

    return data
  }

  public async createMany(exercises: ICreateModifierData[]): Promise<ModifierModel[]> {
    const data = this.ormRepository.create(exercises)

    await this.ormRepository.save(data)

    return data
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear()
  }
}
