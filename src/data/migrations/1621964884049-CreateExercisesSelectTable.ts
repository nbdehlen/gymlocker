import { MigrationInterface, QueryRunner, Table } from 'typeorm'
export class CreateExercisesSelectTable1621964884049 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('ExercisesSelect created')
    await queryRunner.createTable(
      new Table({
        name: 'exercisesSelect',
        columns: [
          {
            name: 'id',
            type: 'string',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'exercise',
            type: 'text',
            isUnique: true,
          },
          // {
          //   name: 'displayName',
          //   type: 'text',
          //   isUnique: true,
          //   isNullable: true,
          // },
          {
            name: 'muscles',
            type: 'text',
          },
          {
            name: 'assistingMuscles',
            type: 'text',
            isNullable: true,
          },
          // {
          //   name: 'tool',
          //   type: 'text',
          //   isNullable: true,
          // },
          {
            name: 'custom',
            type: 'boolean',
            isNullable: false,
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exercisesSelect')
  }
}
