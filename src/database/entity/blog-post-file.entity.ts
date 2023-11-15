import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlogPostFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  path: string;

  @Column({ nullable: true })
  mimetype?: string;
}
