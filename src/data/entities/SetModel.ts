import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ExerciseModel } from './ExerciseModel'

@Entity({ name: 'sets', schema: 'public' })
export class SetModel {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  weight_kg: number

  @Column()
  repetitions: number

  @Column()
  rir: number

  @Index()
  @Column()
  order: number

  @Column()
  exerciseId: number
  @ManyToOne(() => ExerciseModel)
  @JoinColumn({ name: 'exerciseId' })
  exercise: ExerciseModel
}
