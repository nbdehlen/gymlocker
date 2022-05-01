import { MigrationInterface, QueryRunner, Table } from 'typeorm'
export class CreateExercisesSelectTable1621964884049 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('ExerciseSelect created')
    await queryRunner.createTable(
      new Table({
        name: 'exerciseselect',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'exercise', type: 'text' },
          { name: 'custom', type: 'boolean' },
          { name: 'musclesId', type: 'integer' },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exerciseselect')
  }
}
