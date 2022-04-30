import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ExerciseSelectModel } from './ExerciseSelectModel'
import { MuscleModel } from './MuscleModel'

@Entity({ name: 'exselectassist', schema: 'public' })
export class ExSelectAssist {
  @PrimaryColumn()
  exerciseSelectId: string

  @PrimaryColumn()
  muscleId: string

  @ManyToOne(() => ExerciseSelectModel, (ex) => ex.assistingMuscles, { primary: true })
  @JoinColumn({ name: 'exerciseSelectId' })
  exerciseSelect: ExerciseSelectModel

  @ManyToOne(() => MuscleModel, (ast) => ast.exerciseSelect, { primary: true })
  @JoinColumn({ name: 'muscleId' })
  assistingMuscles: MuscleModel
}
