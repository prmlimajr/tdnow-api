import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { decode, sign } from 'jsonwebtoken';
import { User } from 'src/database/entity/user.entity';
import { PRIVATE_KEY } from 'src/config/env';
import { JwtService } from '@nestjs/jwt';
import { hashSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async login(credentials: LoginDto) {
    const { email, password } = credentials;

    const user = await this.findUserByEmail(email);

    await this.validateUserPassword(user, password);

    return this.generateAccessToken(user);
  }

  private async findUserByEmail(email: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.clinics', 'clinics')
      .leftJoinAndSelect('clinics.owner', 'owner')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }

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

  async generatePasswordResetToken(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const payload = { sub: user.id };
    const resetToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // Token expira em 1 hora

    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hora em milissegundos

    await this.usersRepository.save(user);

    return { resetToken };
  }

  async validatePasswordResetToken(
    token: string,
    {
      password,
      passwordConfirmation,
    }: { password: string; passwordConfirmation: string },
  ) {
    const decodedToken = this.jwtService.verify(token);

    if (!decodedToken || !decodedToken.sub) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.usersRepository.findOne({
      where: { id: decodedToken.sub },
    });

    if (
      !user ||
      user.resetToken !== token ||
      user.resetTokenExpiration < new Date()
    ) {
      throw new BadRequestException(
        'Token de recuperação de senha inválido ou expirado',
      );
    }

    if (password !== passwordConfirmation) {
      throw new BadRequestException('As senhas não conferem');
    }

    user.passwordHash = hashSync(password, 12);
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await this.usersRepository.save(user);

    return { message: 'Senha resetada com sucesso' };
  }
}
