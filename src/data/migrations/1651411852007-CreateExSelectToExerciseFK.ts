import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class CreateExSelectToExerciseFK1651411852007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('ExerciseSelect FK to exercises created')

    await queryRunner.createForeignKey(
      'exercises',
      new TableForeignKey({
        name: 'ExerciseSelectToExercises',
        columnNames: ['exerciseSelectId'],
        referencedTableName: 'exerciseselect',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('exercises', 'ExerciseSelectToExercises')
  }
}
