import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VerifyUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  token: string;

  @Column({ nullable: false })
  email: string;

  @Column('json', { nullable: false })
  userData: CreateUserDto;

  @Column({ nullable: false })
  expiresAt: Date;
}
