import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateCardiosTable1622070166549 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Cardios created')
    await queryRunner.createTable(
      new Table({
        name: 'cardios',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'cardioType',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'duration_minutes',
            type: 'integer',
          },
          {
            name: 'calories',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'distance_m',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'order',
            type: 'integer',
          },
          {
            name: 'workout_id',
            type: 'integer',
          },
        ],
      }),
      true
    )

    await queryRunner.createIndex(
      'cardios',
      new TableIndex({
        columnNames: ['order'],
      })
    )
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cardios')
  }
}
