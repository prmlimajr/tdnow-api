import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Clinic } from './clinic.entity';

@Entity()
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: false })
  title: string;

  @Column('text', { nullable: false })
  content: string;

  @ManyToOne(() => Clinic, (clinic) => clinic.blogPosts)
  clinic: Clinic;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
