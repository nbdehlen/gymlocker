import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class CreateWorkoutToCardioFK1622328685466 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Workouts FK to cardio created')
    await queryRunner.createForeignKey(
      'cardios',
      new TableForeignKey({
        name: 'WorkoutToCardios',
        columnNames: ['workout_id'],
        referencedTableName: 'workouts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('cardios', 'WorkoutToCardios')
  }
}
