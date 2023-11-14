import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Clinic } from './clinic.entity';
import { ContactType } from 'src/helpers/constants/contact-type';

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
