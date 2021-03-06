import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateWorkoutTable1622070129180 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Workouts created')

    await queryRunner.createTable(
      new Table({
        name: 'workouts',
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
            name: 'start',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'end',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    )

    await queryRunner.createIndex(
      'workouts',
      new TableIndex({
        columnNames: ['start'],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('workouts')
  }
}
