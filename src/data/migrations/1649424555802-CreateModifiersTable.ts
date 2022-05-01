import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateModifiersTable1649424555802 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Modifiers created')
    await queryRunner.createTable(
      new Table({
        name: 'modifiers',
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
            name: 'modifier',
            type: 'text',
            isUnique: true,
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Modifiers deleted')
    await queryRunner.dropTable('modifiers')
  }
}
