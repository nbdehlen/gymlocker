import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class CreateSetsTable1622070173991 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sets',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
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
            name: 'unit',
            type: 'text',
            isNullable: false,
            default: "'kg'",
          },
          {
            name: 'order',
            type: 'integer',
          },
          {
            name: 'exercise_id',
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

    // await queryRunner.addColumn(
    //   'sets',
    //   new TableColumn({
    //     name: 'exerciseId',
    //     type: 'uuid',
    //     generationStrategy: 'uuid',
    //   })
    // )

    // await queryRunner.createForeignKey(
    //   'sets',
    //   new TableForeignKey({
    //     columnNames: ['exerciseId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'exercises',
    //     onDelete: 'CASCADE',
    //     // onUpdate: 'CASCADE',
    //   })
    // )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sets')
  }
}
