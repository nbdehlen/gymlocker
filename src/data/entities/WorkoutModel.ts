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

@Entity('workouts')
export class WorkoutModel {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Index()
  @Column({ unique: true, default: () => 'CURRENT_TIMESTAMP' })
  start: Date

  @Column({ unique: true, default: () => 'CURRENT_TIMESTAMP' })
  end: Date

  // @CreateDateColumn()
  // createdAt: Date

  // @UpdateDateColumn()
  // updatedAt: Date

  // @OneToMany(() => ExerciseModel, (exercise) => exercise.workout)
  // exercises?: Promise<ExerciseModel[]>

  // @OneToMany(() => CardioModel, (cardio) => cardio.workout)
  // cardios?: Promise<CardioModel[]>
  @OneToMany(() => CardioModel, (cardio) => cardio.workout)
  @JoinTable()
  cardios: CardioModel[]

  @OneToMany(() => ExerciseModel, (exercise) => exercise.workout)
  @JoinTable()
  exercises: ExerciseModel[]
}
