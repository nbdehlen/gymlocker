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

  @Index()
  @Column()
  order: number

  @Column()
  exercise_id: number
  // @ManyToOne((type) => ExerciseModel, (exercise) => exercise.sets, { onDelete: 'CASCADE' })

  @ManyToOne(() => ExerciseModel)
  @JoinColumn({ name: 'exercise_id' })
  exercise: ExerciseModel
}
