import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ExerciseModel } from './ExerciseModel'
import { MuscleModel } from './MuscleModel'

@Entity({ name: 'exassist', schema: 'public' })
export class ExAssist {
  @PrimaryColumn()
  exerciseId: number

  @PrimaryColumn()
  muscleId: number

  @ManyToOne(() => ExerciseModel, (ex) => ex.assistingMuscles, { primary: true })
  @JoinColumn({ name: 'exerciseId' })
  exercise: ExerciseModel

  @ManyToOne(() => MuscleModel, (ast) => ast.exercise, { primary: true })
  @JoinColumn({ name: 'muscleId' })
  assistingMuscle: MuscleModel
}
