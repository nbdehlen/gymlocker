import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ExerciseSelectModel } from './ExerciseSelectModel'
import { ModifierModel } from './ModifierModel'

@Entity({ name: 'exselectmodavailable', schema: 'public' })
export class ExSelectModAvailable {
  @PrimaryColumn()
  exerciseSelectId: number

  @PrimaryColumn()
  modifierId: number

  @ManyToOne(() => ExerciseSelectModel, (ex) => ex.modifiersAvailable, { primary: true })
  @JoinColumn({ name: 'exerciseSelectId' })
  exerciseSelect: ExerciseSelectModel

  @ManyToOne(() => ModifierModel, (ast) => ast.exerciseSelect, { primary: true })
  @JoinColumn({ name: 'modifierId' })
  modifier: ModifierModel
}
