import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ExerciseModel } from './ExerciseModel'

@Entity('sets')
export class SetModel {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  weight_kg: number

  @Column()
  repetitions: number

  @Column({ nullable: false, default: () => "'kg'" })
  unit: string

  @Index()
  @Column()
  order: number

  @Column()
  exercise_id: number
  // @ManyToOne((type) => ExerciseModel, (exercise) => exercise.sets, { onDelete: 'CASCADE' })

  @ManyToOne(() => ExerciseModel)
  @JoinColumn({ name: 'exercise_id' })
  exercises: ExerciseModel
}
