import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import exercisesSelect from '../seeding/starter/exercisesSelect'

export class SeedExercisesSelect1622339639048 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository('exercisesSelect').save(exercisesSelect)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
