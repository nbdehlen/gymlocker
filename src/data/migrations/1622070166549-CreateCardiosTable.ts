import { startOfDay } from 'date-fns'
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

//TODO: change genereated ids to text
export class CreateCardiosTable1622070166549 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Cardios created')
    await queryRunner.createTable(
      new Table({
        name: 'cardios',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'cardioType',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'duration_minutes',
            type: 'integer',
          },
          {
            name: 'calories',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'distance_m',
            type: 'integer',
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
      true
    )

    await queryRunner.createIndex(
      'cardios',
      new TableIndex({
        columnNames: ['order'],
      })
    )

    // await queryRunner.addColumn(
    //   'cardios',
    //   new TableColumn({
    //     name: 'workoutId',
    //     type: 'uuid',
    //     generationStrategy: 'uuid',
    //   })
    // )

    // await queryRunner.createForeignKey(
    //   'cardios',
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
    await queryRunner.dropTable('cardios')
  }
}
