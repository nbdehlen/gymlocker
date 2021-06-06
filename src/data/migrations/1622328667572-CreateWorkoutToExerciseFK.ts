import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class CreateWorkoutToExerciseFK1622328667572 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Workouts FK to exercises created')

    await queryRunner.createForeignKey(
      'exercises',
      new TableForeignKey({
        name: 'WorkoutToExercises',
        columnNames: ['workout_id'],
        referencedTableName: 'workouts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('exercises', 'WorkoutToExercises')
  }
}
