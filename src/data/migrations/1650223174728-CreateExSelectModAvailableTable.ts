import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateExSelectModAvailableTable1650223174728 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'exselectmodavailable',
        columns: [
          {
            name: 'exerciseSelectId',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'modifierId',
            type: 'varchar',
            isPrimary: true,
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exselectmodavailable')
  }
}
