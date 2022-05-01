import { Column, Entity, Index, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExerciseSelectModel } from './ExerciseSelectModel'
import { ExMod } from './ExMod'
import { SetModel } from './SetModel'
import { WorkoutModel } from './WorkoutModel'

@Entity({ name: 'exercises', schema: 'public' })
export class ExerciseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  exercise: string

  @Index()
  @Column()
  order: number

  @Column()
  workout_id: string

  @ManyToOne(() => WorkoutModel)
  @JoinColumn({ name: 'workout_id' })
  workout?: WorkoutModel

  @OneToMany(() => SetModel, (set) => set.exercise)
  @JoinTable()
  sets: SetModel[]

  @OneToMany(() => ExMod, (exMod) => exMod.exercise, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  modifiers?: ExMod[]

  @Column()
  exerciseSelectId: string

  @ManyToOne(() => ExerciseSelectModel)
  @JoinColumn({ name: 'exerciseSelectId' })
  exerciseSelect?: ExerciseSelectModel
}
