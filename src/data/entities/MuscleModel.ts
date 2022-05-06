import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExSelectAssist } from './ExSelectAssist'

@Entity({ name: 'muscles', schema: 'public' })
export class MuscleModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  muscle: string

  @OneToMany(() => ExSelectAssist, (exSelectAssist) => exSelectAssist.assistingMuscles)
  exerciseSelect: ExSelectAssist[]
}
