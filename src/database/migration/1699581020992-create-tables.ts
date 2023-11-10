import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1699581020992 implements MigrationInterface {
    name = 'CreateTables1699581020992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "number" character varying, "complement" character varying, "neighborhood" character varying, "city" character varying, "state" character varying, "zipCode" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying, "document" character varying, "documentType" character varying, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."clinic_contact_type_enum" AS ENUM('email', 'phone', 'cellphone', 'whatsapp', 'instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'website')`);
        await queryRunner.query(`CREATE TABLE "clinic_contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contact" character varying NOT NULL, "type" "public"."clinic_contact_type_enum" NOT NULL DEFAULT 'phone', "clinicId" uuid NOT NULL, CONSTRAINT "PK_bec9c0d709df2a894e8f27c6a8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "clinicId" uuid, CONSTRAINT "PK_694e842ad1c2b33f5939de6fede" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clinic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "legalName" character varying, "cnpj" character varying, "addressId" uuid, "ownerId" uuid NOT NULL, CONSTRAINT "REL_905abb487a9409f94ebeb2c8cb" UNIQUE ("addressId"), CONSTRAINT "REL_e03384d243f674489547119242" UNIQUE ("ownerId"), CONSTRAINT "PK_8e97c18debc9c7f7606e311d763" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clinic_contact" ADD CONSTRAINT "FK_e47d371a2baa78f0bda6c1c45bb" FOREIGN KEY ("clinicId") REFERENCES "clinic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_post" ADD CONSTRAINT "FK_dffb8ad20e01e6e21d5e4942f6e" FOREIGN KEY ("clinicId") REFERENCES "clinic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clinic" ADD CONSTRAINT "FK_905abb487a9409f94ebeb2c8cb9" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clinic" ADD CONSTRAINT "FK_e03384d243f674489547119242b" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`INSERT INTO "role" ("name") VALUES ('SuperAdmin'), ('Admin'), ('User')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clinic" DROP CONSTRAINT "FK_e03384d243f674489547119242b"`);
        await queryRunner.query(`ALTER TABLE "clinic" DROP CONSTRAINT "FK_905abb487a9409f94ebeb2c8cb9"`);
        await queryRunner.query(`ALTER TABLE "blog_post" DROP CONSTRAINT "FK_dffb8ad20e01e6e21d5e4942f6e"`);
        await queryRunner.query(`ALTER TABLE "clinic_contact" DROP CONSTRAINT "FK_e47d371a2baa78f0bda6c1c45bb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`DROP TABLE "clinic"`);
        await queryRunner.query(`DROP TABLE "blog_post"`);
        await queryRunner.query(`DROP TABLE "clinic_contact"`);
        await queryRunner.query(`DROP TYPE "public"."clinic_contact_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DELETE FROM "role" WHERE "name" IN ('SuperAdmin', 'Admin', 'User')`);
    }

}
