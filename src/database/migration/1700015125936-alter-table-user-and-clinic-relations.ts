import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUserAndClinicRelations1700015125936 implements MigrationInterface {
    name = 'AlterTableUserAndClinicRelations1700015125936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_57bf06a7d55ffeba856d641d91e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_57bf06a7d55ffeba856d641d91e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "clinicId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "clinicId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_57bf06a7d55ffeba856d641d91e" UNIQUE ("clinicId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_57bf06a7d55ffeba856d641d91e" FOREIGN KEY ("clinicId") REFERENCES "clinic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
