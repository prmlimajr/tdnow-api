import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUserAndClinicRelationsManyToMany1700015973247 implements MigrationInterface {
    name = 'AlterTableUserAndClinicRelationsManyToMany1700015973247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_clinics_clinic" ("userId" uuid NOT NULL, "clinicId" uuid NOT NULL, CONSTRAINT "PK_53a11fc287614984dd210673ff2" PRIMARY KEY ("userId", "clinicId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_876fcc9c4d13e9c3662c4ef3ef" ON "user_clinics_clinic" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_382f66f13f4fd9e3affc3304e0" ON "user_clinics_clinic" ("clinicId") `);
        await queryRunner.query(`ALTER TABLE "user_clinics_clinic" ADD CONSTRAINT "FK_876fcc9c4d13e9c3662c4ef3efe" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_clinics_clinic" ADD CONSTRAINT "FK_382f66f13f4fd9e3affc3304e0a" FOREIGN KEY ("clinicId") REFERENCES "clinic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_clinics_clinic" DROP CONSTRAINT "FK_382f66f13f4fd9e3affc3304e0a"`);
        await queryRunner.query(`ALTER TABLE "user_clinics_clinic" DROP CONSTRAINT "FK_876fcc9c4d13e9c3662c4ef3efe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_382f66f13f4fd9e3affc3304e0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_876fcc9c4d13e9c3662c4ef3ef"`);
        await queryRunner.query(`DROP TABLE "user_clinics_clinic"`);
    }

}
