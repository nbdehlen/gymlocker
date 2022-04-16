import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateExAssistTable1649559160302 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'exassist',
        columns: [
          {
            name: 'exerciseId',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'muscleId',
            type: 'integer',
            isPrimary: true,
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exassist')
  }
}
