import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { User } from './user.entity';
import { ClinicContact } from './clinic-contact.entity';
import { BlogPost } from './blog-post.entity';

@Entity()
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  legalName?: string;

  @Column({ nullable: true })
  cnpj?: string;

  @OneToOne(() => Address, { nullable: true })
  @JoinColumn()
  address?: Address;

  @OneToMany(() => ClinicContact, (clinicContact) => clinicContact.clinic)
  contacts: ClinicContact[];

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  owner: User;

  @OneToMany(() => BlogPost, (blogPost) => blogPost.clinic)
  @JoinColumn()
  blogPosts: BlogPost[];
}
