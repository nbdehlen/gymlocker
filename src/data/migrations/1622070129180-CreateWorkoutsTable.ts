import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class CreateWorkoutTable1622070129180 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Workouts created')

    await queryRunner.createTable(
      new Table({
        name: 'workouts',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'start',
            type: 'timestamp',
            isUnique: true,
            default: 'now()',
          },
          {
            name: 'end',
            type: 'timestamp',
            isUnique: true,
            default: 'now()',
          },
        ],
      }),
      true
      // true,
      // true
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
