import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { WorkoutModel } from './WorkoutModel'

@Entity('cardios')
export class CardioModel {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ nullable: true })
  cardioType: string

  @Column()
  duration_minutes: number

  @Column({ nullable: true })
  calories: number

  @Column({ nullable: true })
  distance_m: number

  @Index()
  @Column()
  order: number

  @Column()
  workout_id: number

  @ManyToOne(() => WorkoutModel)
  //  (workout) => workout.cardios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workout_id' })
  workout_two: WorkoutModel
}
