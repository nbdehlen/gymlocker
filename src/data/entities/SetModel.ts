import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ExerciseModel } from './ExerciseModel'

@Entity('sets')
export class SetModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  weight: number

  @Column()
  repetitions: number

  @Column({ default: 'kg' })
  unit: string

  @ManyToOne((type) => ExerciseModel, (exercise) => exercise.sets)
  exercise: ExerciseModel
}
