import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('exercisesSelect')
export class ExerciseSelectModel {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ unique: true })
  exercise: string

  @Column()
  muscles: string

  @Column({ nullable: true })
  assistingMuscles: string

  @Column({ nullable: true })
  tool: string

  @Column({ default: true })
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
 *    Scale: KG / Pounds ???? or just asyncStorage
 *    Weight: number
 *    Calories: number
 *    length: string
 */
