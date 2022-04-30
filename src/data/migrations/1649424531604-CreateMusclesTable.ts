import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateMusclesTable1649424531604 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Muscles created')
    await queryRunner.createTable(
      new Table({
        name: 'muscles',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'muscle',
            type: 'text',
            isUnique: true,
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Muscles deleted')
    await queryRunner.dropTable('muscles')
  }
}
