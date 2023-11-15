import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableVerifyUserAddColumnEmail1700010024734 implements MigrationInterface {
    name = 'AlterTableVerifyUserAddColumnEmail1700010024734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verify_user" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verify_user" DROP COLUMN "email"`);
    }

}
