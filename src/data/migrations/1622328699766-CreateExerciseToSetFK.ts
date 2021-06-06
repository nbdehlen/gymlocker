import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class CreateExerciseToSetFK1622328699766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Exercises FK to sets created')
    await queryRunner.createForeignKey(
      'sets',
      new TableForeignKey({
        name: 'ExerciseToSets',
        columnNames: ['exercise_id'],
        referencedTableName: 'exercises',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('sets', 'ExerciseToSets')
  }
}
