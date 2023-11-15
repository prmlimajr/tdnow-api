import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Clinic } from './clinic.entity';
import { BlogPostFile } from './blog-post-file.entity';

@Entity()
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: false })
  title: string;

  @Column('text', { nullable: false })
  content: string;

  @ManyToOne(() => Clinic, (clinic) => clinic.blogPosts)
  clinic: Clinic;

  @OneToOne(() => BlogPostFile)
  @JoinColumn()
  file?: BlogPostFile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  link?: string;
}
