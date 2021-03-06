import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateExerciseTable1622070137142 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Exercises created')
    await queryRunner.createTable(
      new Table({
        name: 'exercises',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'exercise',
            type: 'text',
          },
          {
            name: 'order',
            type: 'integer',
          },
          {
            name: 'workout_id',
            type: 'integer',
          },
          {
            name: 'exerciseSelectId',
            type: 'integer',
          },
        ],
      }),
      true
    )
    await queryRunner.createIndex(
      'exercises',
      new TableIndex({
        columnNames: ['order'],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exercises')
  }
}
