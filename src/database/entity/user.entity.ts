import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

export enum DocumentType {
  CPF = 'cpf',
  CNPJ = 'cnpj',
  RG = 'rg',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  document: string;

  @Column({ nullable: true })
  documentType: DocumentType;

  @Column({ nullable: false })
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

  @OneToOne(() => Clinic)
  @JoinColumn()
  clinic: Clinic;

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
