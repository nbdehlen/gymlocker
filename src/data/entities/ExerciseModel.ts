import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { SetModel } from './SetModel'
import { WorkoutModel } from './WorkoutModel'

@Entity('exercises')
export class ExerciseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  exercise: string

  @Column({ unique: true, nullable: true })
  displayName: string

  @Column()
  muscles: string

  @Column({ nullable: true })
  assistingMuscles: string

  @Column({ nullable: true })
  tool: string

  @Column({ default: new Date() })
  start: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany((type) => SetModel, (set) => set.exercise)
  sets: Promise<SetModel[]>

  @ManyToOne((type) => WorkoutModel, (workout) => workout.exercises)
  workout: WorkoutModel
}
