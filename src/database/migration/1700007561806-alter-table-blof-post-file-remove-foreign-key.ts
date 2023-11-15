import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableBlofPostFileRemoveForeignKey1700007561806 implements MigrationInterface {
    name = 'AlterTableBlofPostFileRemoveForeignKey1700007561806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_post_file" DROP CONSTRAINT "FK_edfbaa8636dde232dc5fc685520"`);
        await queryRunner.query(`ALTER TABLE "blog_post_file" DROP CONSTRAINT "REL_edfbaa8636dde232dc5fc68552"`);
        await queryRunner.query(`ALTER TABLE "blog_post_file" DROP COLUMN "blogPostId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_post_file" ADD "blogPostId" uuid`);
        await queryRunner.query(`ALTER TABLE "blog_post_file" ADD CONSTRAINT "REL_edfbaa8636dde232dc5fc68552" UNIQUE ("blogPostId")`);
        await queryRunner.query(`ALTER TABLE "blog_post_file" ADD CONSTRAINT "FK_edfbaa8636dde232dc5fc685520" FOREIGN KEY ("blogPostId") REFERENCES "blog_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
