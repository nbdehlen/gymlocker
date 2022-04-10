import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExSelectAssist } from './ExSelectAssist'
import { MuscleModel } from './MuscleModel'

@Entity({ name: 'exerciseselect', schema: 'public' })
export class ExerciseSelectModel {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number

  @Column({ unique: true })
  exercise: string

  @Column()
  custom: boolean

  @ManyToOne(() => MuscleModel)
  muscles: MuscleModel

  @Column()
  musclesId: number

  @OneToMany(() => ExSelectAssist, (exSelectAssist) => exSelectAssist.exerciseSelect, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  assistingMuscles: ExSelectAssist[]
}
