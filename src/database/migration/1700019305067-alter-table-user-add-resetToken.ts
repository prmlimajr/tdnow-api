import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUserAddResetToken1700019305067 implements MigrationInterface {
    name = 'AlterTableUserAddResetToken1700019305067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "resetToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "resetTokenExpiration" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "verify_user" ADD CONSTRAINT "UQ_9f25de16eee012d343d63c77565" UNIQUE ("token")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verify_user" DROP CONSTRAINT "UQ_9f25de16eee012d343d63c77565"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetTokenExpiration"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetToken"`);
    }

}
