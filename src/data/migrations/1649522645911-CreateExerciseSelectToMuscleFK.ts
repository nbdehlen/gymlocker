import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class CreateExerciseSelectToMuscleFK1649522645911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('ExerciseSelectToMuscle FK created')
    await queryRunner.createForeignKey(
      'exerciseselect',
      new TableForeignKey({
        name: 'ExerciseSelectToMuscle',
        columnNames: ['musclesId'],
        referencedTableName: 'muscles',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('exerciseselect', 'ExerciseSelectToMuscle')
  }
}
