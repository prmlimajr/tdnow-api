import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { sign } from 'jsonwebtoken';
import { PRIVATE_KEY } from 'src/config/env';
import { Role } from './role.entity';
import { compareSync } from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Clinic } from './clinic.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Role)
  @JoinColumn()
  role: Role; // User, Admin, SuperAdmin

  @ManyToMany(() => Clinic, (clinic) => clinic.users)
  @JoinTable()
  clinics: Clinic[];

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpiration: Date;

  toJSON() {
    return {
      ...this,
      passwordHash: undefined,
    };
  }

  generateToken(): string {
    const token = sign({ sub: this.id }, PRIVATE_KEY, {
      expiresIn: '3h',
      algorithm: 'HS256',
    });

    return token;
  }

  validPassword(password: string): boolean {
    const checkIfPasswordMatches = compareSync(password, this.passwordHash);

    if (!checkIfPasswordMatches) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }

    return checkIfPasswordMatches;
  }
}
