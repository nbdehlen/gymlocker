import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ExerciseSelectModel } from './ExerciseSelectModel'
import { ModifierModel } from './ModifierModel'

@Entity({ name: 'exselectmodavailable', schema: 'public' })
export class ExSelectModAvailable {
  @PrimaryColumn()
  exerciseSelectId: string

  @PrimaryColumn()
  modifierId: string

  @ManyToOne(() => ExerciseSelectModel, (ex) => ex.modifiersAvailable, { primary: true })
  @JoinColumn({ name: 'exerciseSelectId' })
  exerciseSelect: ExerciseSelectModel

  @ManyToOne(() => ModifierModel, (exSelectModAvailable) => exSelectModAvailable.exerciseSelect, { primary: true })
  @JoinColumn({ name: 'modifierId' })
  modifier: ModifierModel
}
