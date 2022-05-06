import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ExerciseModel } from './ExerciseModel'
import { ModifierModel } from './ModifierModel'

@Entity({ name: 'exmod', schema: 'public' })
export class ExMod {
  @PrimaryColumn()
  exerciseId: string

  @PrimaryColumn()
  modifierId: string

  @ManyToOne(() => ExerciseModel, (exercises) => exercises.modifiers, { primary: true })
  @JoinColumn({ name: 'exerciseId' })
  exercise?: ExerciseModel

  @ManyToOne(() => ModifierModel, (exMod) => exMod.exercise, { primary: true })
  @JoinColumn({ name: 'modifierId' })
  modifier?: ModifierModel
}
