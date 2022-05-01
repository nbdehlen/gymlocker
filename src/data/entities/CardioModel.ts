import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { WorkoutModel } from './WorkoutModel'

@Entity({ name: 'cardios', schema: 'public' })
export class CardioModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

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
  workout_id: string

  @ManyToOne(() => WorkoutModel)
  @JoinColumn({ name: 'workout_id' })
  workout: WorkoutModel
}
