import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateExModTable1650227754167 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'exmod',
        columns: [
          {
            name: 'exerciseId',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'modifierId',
            type: 'integer',
            isPrimary: true,
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exmod')
  }
}
