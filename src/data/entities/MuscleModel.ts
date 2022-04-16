import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExAssist } from './ExAssist'
import { ExSelectAssist } from './ExSelectAssist'

@Entity({ name: 'muscles', schema: 'public' })
export class MuscleModel {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number

  @Column({ unique: true })
  muscle: string

  @OneToMany(() => ExSelectAssist, (exSelectAssist) => exSelectAssist.assistingMuscles)
  exerciseSelect: ExSelectAssist[]

  @OneToMany(() => ExAssist, (exAssist) => exAssist.assistingMuscle)
  exercise: ExAssist[]
}
