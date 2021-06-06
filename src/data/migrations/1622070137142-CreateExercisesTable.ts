import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class CreateExerciseTable1622070137142 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Exercises created')
    await queryRunner.createTable(
      new Table({
        name: 'exercises',
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
            name: 'order',
            type: 'integer',
          },
          {
            name: 'workout_id',
            type: 'integer',
          },
        ],
      }),
      true,
      true
    )
    await queryRunner.createIndex(
      'exercises',
      new TableIndex({
        columnNames: ['order'],
      })
    )

    // await queryRunner.addColumn(
    //   'exercises',
    //   new TableColumn({
    //     name: 'workoutId',
    //     type: 'uuid',
    //     generationStrategy: 'uuid',
    //   })
    // )

    // await queryRunner.createForeignKey(
    //   'exercises',
    //   new TableForeignKey({
    //     columnNames: ['workoutId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'workouts',
    //     onDelete: 'CASCADE',
    //     // onUpdate: 'CASCADE',
    //   })
    // )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exercises')
  }
}
