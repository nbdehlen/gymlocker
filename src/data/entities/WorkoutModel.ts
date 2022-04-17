import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { CardioModel } from './CardioModel'
import { ExerciseModel } from './ExerciseModel'

@Entity({ name: 'workouts', schema: 'public' })
export class WorkoutModel {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Index()
  @Column({ unique: true, default: () => 'CURRENT_TIMESTAMP' })
  start: Date

  @Column({ unique: true, default: () => 'CURRENT_TIMESTAMP' })
  end: Date

  @OneToMany(() => CardioModel, (cardio) => cardio.workout)
  @JoinTable()
  cardios?: CardioModel[]

  @OneToMany(() => ExerciseModel, (exercise) => exercise.workout)
  @JoinTable()
  exercises?: ExerciseModel[]
}
