import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlogPost } from './blog-post.entity';

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

  @OneToOne(() => BlogPost, { nullable: true })
  @JoinColumn()
  blogPost?: BlogPost;
}
