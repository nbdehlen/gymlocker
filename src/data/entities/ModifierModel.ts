import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExMod } from './ExMod'
import { ExSelectModAvailable } from './ExSelectModAvailable'

@Entity({ name: 'modifiers', schema: 'public' })
export class ModifierModel {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  modifier: string

  @OneToMany(() => ExSelectModAvailable, (exSelectModAvailable) => exSelectModAvailable.modifier)
  exerciseSelect: ExSelectModAvailable[]

  @OneToMany(() => ExMod, (exMod) => exMod.modifier)
  exercise: ExMod[]
}
