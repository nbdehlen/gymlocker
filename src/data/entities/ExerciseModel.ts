import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { SetModel } from './SetModel'
import { WorkoutModel } from './WorkoutModel'

@Entity({ name: 'exercises', schema: 'public' })
export class ExerciseModel {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  exercise: string

  @Column()
  muscles: string

  @Column({ nullable: true })
  assistingMuscles: string

  @Index()
  @Column()
  order: number

  @Column()
  workout_id: number

  @ManyToOne(() => WorkoutModel)
  // , (workout) => workout.exercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workout_id' })
  workout: WorkoutModel

  @OneToMany(() => SetModel, (set) => set.exercise)
  @JoinTable()
  // sets: Promise<SetModel[]>
  sets: SetModel[]
}
