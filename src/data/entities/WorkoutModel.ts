import { Column, Entity, Index, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { CardioModel } from './CardioModel'
import { ExerciseModel } from './ExerciseModel'

@Entity({ name: 'workouts', schema: 'public' })
export class WorkoutModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

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
