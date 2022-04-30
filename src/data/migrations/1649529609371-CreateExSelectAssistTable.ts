import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateExSelectAssistTable1649529609371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'exselectassist',
        columns: [
          {
            name: 'exerciseSelectId',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'muscleId',
            type: 'varchar',
            isPrimary: true,
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exselectassist')
  }
}
