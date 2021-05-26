import { getRepository, MigrationInterface, QueryRunner, Table } from 'typeorm'
import exercisesSelect from '../seeding/starter/exercisesSelect'

export class CreateExercisesSelectTable1621964884049 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'exercisesSelect',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'exercise',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'displayName',
            type: 'text',
          },
          {
            name: 'muscles',
            type: 'text',
          },
          {
            name: 'assistingMuscles',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tool',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'custom',
            type: 'boolean',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exercisesSelect')
  }
}
