import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExSelectAssist } from './ExSelectAssist'

@Entity({ name: 'muscles', schema: 'public' })
export class MuscleModel {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number

  @Column({ unique: true })
  muscle: string

  @OneToMany(() => ExSelectAssist, (exSelectAssist) => exSelectAssist.assistingMuscles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  exerciseSelect: ExSelectAssist[]
}
