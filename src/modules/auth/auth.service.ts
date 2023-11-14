import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { decode, sign } from 'jsonwebtoken';
import { User } from 'src/database/entity/user.entity';
import { PRIVATE_KEY } from 'src/config/env';
import { Clinic } from 'src/database/entity/clinic.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
  ) {}

  async login(credentials: LoginDto) {
    const { email, password } = credentials;

    const user = await this.findUserByEmail(email);

    await this.validateUserPassword(user, password);

    return this.generateAccessToken(user);
  }

  private async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['role', 'clinic'],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }

    const clinic = await this.clinicsRepository.findOne({
      where: { owner: { id: user.id } },
      relations: ['address', 'contacts'],
    });

    user.clinic = clinic;

    return user;
  }

  private async validateUserPassword(user: User, password: string) {
    const valid = user.validPassword(password);

    if (!valid) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }
  }

  generateToken(userId: string, expiresIn: string | number) {
    const token = sign({ sub: userId }, PRIVATE_KEY, {
      expiresIn: expiresIn,
      algorithm: 'RS256',
    });

    return token;
  }

  private async generateAccessToken(user: User) {
    const token = user.generateToken();

    const { exp, iat } = decode(token) as any;

    const expirationDate = new Date(exp * 1000);

    const issueDate = new Date(iat * 1000);

    return {
      token,
      issuedAt: issueDate.toISOString(),
      expiresAt: expirationDate.toISOString(),
      user,
      customerConfig: {},
    };
  }
}
