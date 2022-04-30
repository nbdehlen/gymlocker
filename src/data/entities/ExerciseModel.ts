import { Column, Entity, Index, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExAssist } from './ExAssist'
import { ExMod } from './ExMod'
import { MuscleModel } from './MuscleModel'
import { SetModel } from './SetModel'
import { WorkoutModel } from './WorkoutModel'

@Entity({ name: 'exercises', schema: 'public' })
export class ExerciseModel {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  exercise: string

  @Index()
  @Column()
  order: number

  @Column()
  workout_id: number

  @ManyToOne(() => WorkoutModel)
  @JoinColumn({ name: 'workout_id' })
  workout: WorkoutModel

  @OneToMany(() => SetModel, (set) => set.exercise)
  @JoinTable()
  sets: SetModel[]

  @ManyToOne(() => MuscleModel)
  muscles: MuscleModel

  @Column()
  musclesId: number

  @OneToMany(() => ExAssist, (exAssist) => exAssist.exercise, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assistingMuscles?: ExAssist[]

  @OneToMany(() => ExMod, (exMod) => exMod.exercise, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  modifiers?: ExMod[]
}
