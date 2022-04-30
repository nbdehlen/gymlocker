import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateSetsTable1622070173991 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Sets created')

    await queryRunner.createTable(
      new Table({
        name: 'sets',
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
            name: 'weight_kg',
            type: 'integer',
          },
          {
            name: 'repetitions',
            type: 'integer',
          },
          {
            name: 'rir',
            type: 'integer',
          },
          {
            name: 'order',
            type: 'integer',
          },
          {
            name: 'exerciseId',
            type: 'integer',
          },
        ],
      }),
      true
    )

    await queryRunner.createIndex(
      'sets',
      new TableIndex({
        columnNames: ['order'],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sets')
  }
}
