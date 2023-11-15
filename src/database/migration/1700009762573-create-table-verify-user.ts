import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableVerifyUser1700009762573 implements MigrationInterface {
    name = 'CreateTableVerifyUser1700009762573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "verify_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "userData" json NOT NULL, "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_0257bd07f793442c718cfe5f7bf" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "verify_user"`);
    }

}
