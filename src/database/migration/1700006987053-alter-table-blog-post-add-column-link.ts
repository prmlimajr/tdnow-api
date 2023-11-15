import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableBlogPostAddColumnLink1700006987053 implements MigrationInterface {
    name = 'AlterTableBlogPostAddColumnLink1700006987053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_post" ADD "link" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_post" DROP COLUMN "link"`);
    }

}
