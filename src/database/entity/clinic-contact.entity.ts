import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Clinic } from './clinic.entity';

enum ContactType {
  EMAIL = 'email',
  PHONE = 'phone',
  CELLPHONE = 'cellphone',
  WHATSAPP = 'whatsapp',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
  WEBSITE = 'website',
}

@Entity()
export class ClinicContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  contact: string;

  @Column('enum', { enum: ContactType, default: ContactType.PHONE })
  type: ContactType;

  @ManyToOne(() => Clinic, { nullable: false })
  clinic: Clinic;
}
