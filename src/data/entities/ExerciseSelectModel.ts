import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'exercisesselect', schema: 'public' })
export class ExerciseSelectModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  exercise: string

  // @Column({ unique: true, nullable: true })
  // displayName: string

  @Column()
  muscles: string

  @Column({ nullable: true })
  assistingMuscles: string

  // @Column({ nullable: true })
  // tool: string

  @Column()
  custom: boolean
}

/**
 * Exercises select
 *    Creation: Default : Custom
 *    Muscles: string[]
 *    Compound: bool
 */

/**
 * Exercises
 *    Day: Date
 *    Name: string
 *    Weight: string
 *    time: string
 *    Reps: String
 *    Muscles: string[]
 *    Compound: bool
 */

/**
 * Cardio / Other
 *    Type: Cardio / HIIT
 *    Day: Date
 *    Name: string
 *    time: Date
 *    length: string
 */

/**
 *  Person Updates
 *    Day: Date
 *    unit: KG / Pounds ???? or just asyncStorage
 *    Weight: number
 *    Calories: number
 *    length: string
 */
