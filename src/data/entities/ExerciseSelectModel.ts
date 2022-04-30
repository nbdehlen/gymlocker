import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExSelectAssist } from './ExSelectAssist'
import { ExSelectModAvailable } from './ExSelectModAvailable'
import { MuscleModel } from './MuscleModel'

@Entity({ name: 'exerciseselect', schema: 'public' })
export class ExerciseSelectModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  exercise: string

  @Column()
  custom: boolean

  @ManyToOne(() => MuscleModel)
  muscles: MuscleModel

  @Column()
  musclesId: string

  @OneToMany(() => ExSelectAssist, (exSelectAssist) => exSelectAssist.exerciseSelect, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assistingMuscles: ExSelectAssist[]

  @OneToMany(() => ExSelectModAvailable, (exSelectModAvailable) => exSelectModAvailable.exerciseSelect, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  modifiersAvailable: ExSelectModAvailable[]
}
