import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { CardioModel } from './CardioModel'
import { ExerciseModel } from './ExerciseModel'

@Entity('workout')
export class WorkoutModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, default: new Date() })
  start: Date

  @Column({ unique: true, default: new Date() })
  end: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany((type) => ExerciseModel, (exercise) => exercise.workout)
  exercises?: Promise<ExerciseModel[]>

  @OneToMany((type) => CardioModel, (cardio) => cardio.workout)
  cardios?: Promise<CardioModel[]>
}
