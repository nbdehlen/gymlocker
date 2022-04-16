import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class CreateExerciseToMuscleFK1649559186904 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('ExerciseToMuscle FK created')
    await queryRunner.createForeignKey(
      'exercises',
      new TableForeignKey({
        name: 'ExerciseToMuscle',
        columnNames: ['musclesId'],
        referencedTableName: 'muscles',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('exercises', 'ExerciseToMuscle')
  }
}
