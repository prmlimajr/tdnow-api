import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableBlogPostFile1699923849326 implements MigrationInterface {
    name = 'CreateTableBlogPostFile1699923849326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog_post_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying, "blogPostId" uuid, CONSTRAINT "REL_edfbaa8636dde232dc5fc68552" UNIQUE ("blogPostId"), CONSTRAINT "PK_f4406bde52769b31a96abd35081" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blog_post" ADD "fileId" uuid`);
        await queryRunner.query(`ALTER TABLE "blog_post" ADD CONSTRAINT "UQ_6dc14b22a4e4b7ed0657a9a9f5f" UNIQUE ("fileId")`);
        await queryRunner.query(`ALTER TABLE "blog_post" ALTER COLUMN "slug" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blog_post_file" ADD CONSTRAINT "FK_edfbaa8636dde232dc5fc685520" FOREIGN KEY ("blogPostId") REFERENCES "blog_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_post" ADD CONSTRAINT "FK_6dc14b22a4e4b7ed0657a9a9f5f" FOREIGN KEY ("fileId") REFERENCES "blog_post_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_post" DROP CONSTRAINT "FK_6dc14b22a4e4b7ed0657a9a9f5f"`);
        await queryRunner.query(`ALTER TABLE "blog_post_file" DROP CONSTRAINT "FK_edfbaa8636dde232dc5fc685520"`);
        await queryRunner.query(`ALTER TABLE "blog_post" ALTER COLUMN "slug" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blog_post" DROP CONSTRAINT "UQ_6dc14b22a4e4b7ed0657a9a9f5f"`);
        await queryRunner.query(`ALTER TABLE "blog_post" DROP COLUMN "fileId"`);
        await queryRunner.query(`DROP TABLE "blog_post_file"`);
    }

}
