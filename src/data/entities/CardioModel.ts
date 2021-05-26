import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { WorkoutModel } from './WorkoutModel'

@Entity('cardios')
export class CardioModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, default: new Date() })
  start: Date

  @Column({ unique: true, default: new Date() })
  end: Date

  @Column({ nullable: true })
  cardioType: string

  @Column({ nullable: true })
  calories: number

  @Column({ nullable: true })
  meters: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne((type) => WorkoutModel, (workout) => workout.cardios)
  workout: WorkoutModel
}
