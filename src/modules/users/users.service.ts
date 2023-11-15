import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { hashSync } from 'bcrypt';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { Paginator } from 'src/helpers/pagination/pagination';
import { Role } from 'src/database/entity/role.entity';
import { Clinic } from 'src/database/entity/clinic.entity';
import { VerifyUser } from 'src/database/entity/verify-user.entity';
import { VerifyUserDto } from './dto/verify-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
    @InjectRepository(VerifyUser)
    private verifyUserRepository: Repository<VerifyUser>,
  ) {}

  private applyFilters(
    query: SelectQueryBuilder<User>,
    filters?: UserFiltersDto,
  ): SelectQueryBuilder<User> {
    const { search } = filters;

    if (search) {
      query.andWhere('user.firstName ILIKE :search', {
        search: `%${search}%`,
      });
      query.orWhere('user.lastName ILIKE :search', { search: `%${search}%` });
      query.orWhere('user.email ILIKE :search', { search: `%${search}%` });
    }

    return query;
  }

  private async setUserRole(userDto: CreateUserDto, newUser: User) {
    if (userDto.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: userDto.roleId },
      });

      if (!role) {
        throw new NotFoundException('Papel não encontrado');
      }

      newUser.role = role;

      return newUser;
    }

    const role = await this.roleRepository.findOne({
      where: { name: 'User' },
    });

    if (!role) {
      throw new NotFoundException('Papel não encontrado');
    }

    newUser.role = role;

    return newUser;
  }

  private validatePassword(password: string, passwordConfirmation: string) {
    if (password !== passwordConfirmation) {
      throw new BadRequestException('Senhas não conferem');
    }

    const passwordValidationRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%*&(){}<>?\|]).{8,}$/;

    const isPasswordValid = passwordValidationRegex.test(password);

    if (!isPasswordValid) {
      throw new BadRequestException(
        'Senha deve conter ao menos 8 caracteres, uma letra maiuscula, uma minuscula, um numero e um caracter especial',
      );
    }
  }

  private async sendEmail(email: string, token: string) {
    // TODO
    console.log('Email enviado para ' + email + ' com o token ' + token);
  }

  private async generateCreateUserToken(user: CreateUserDto) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    const verifyToken = await this.verifyUserRepository.findOne({
      where: { token },
    });

    let tokenExists = !!verifyToken;

    while (tokenExists) {
      const newToken = Math.floor(100000 + Math.random() * 900000).toString();

      const newVerifyToken = await this.verifyUserRepository.findOne({
        where: { token: newToken },
      });

      tokenExists = !!newVerifyToken;
    }

    const expiresAt = new Date();

    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const verifyUser = {
      token,
      email: user.email,
      userData: user,
      expiresAt,
    };

    await this.sendEmail(user.email, token);

    return this.verifyUserRepository.save(verifyUser);
  }

  async verifyUserAtCreation(user: CreateUserDto) {
    this.validatePassword(user.password, user.passwordConfirmation);

    const emailExists = await this.usersRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('Email já cadastrado');
    }

    if (user.clinicId) {
      const clinicExists = await this.clinicsRepository.findOne({
        where: {
          id: user.clinicId,
        },
      });

      if (!clinicExists) {
        throw new NotFoundException('Clinica não encontrada');
      }
    }

    return this.generateCreateUserToken(user);
  }

  async verifyUser(verifyUserDto: VerifyUserDto) {
    const { token } = verifyUserDto;

    const verifyUser = await this.verifyUserRepository.findOne({
      where: {
        token,
      },
    });

    if (!verifyUser) {
      throw new NotFoundException('Token inválido');
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = Math.floor(verifyUser.expiresAt.getTime() / 1000);

    if (expiresAt < now) {
      throw new BadRequestException('Token expirado');
    }

    return this.verifyUserRepository.manager.transaction(async (manager) => {
      const verifyUserRepo = manager.getRepository(VerifyUser);
      const userRepo = manager.getRepository(User);
      const clinicRepo = manager.getRepository(Clinic);

      const newUser = userRepo.create(verifyUser.userData);

      newUser.passwordHash = hashSync(verifyUser.userData.password, 12);

      if (verifyUser.userData.clinicId) {
        const clinic = await clinicRepo.findOne({
          where: {
            id: verifyUser.userData.clinicId,
          },
        });

        if (!clinic) {
          throw new NotFoundException('Clinica não encontrada');
        }

        newUser.clinics = [clinic];
      }

      const newUserWithRole = await this.setUserRole(
        verifyUser.userData,
        newUser,
      );

      await userRepo.save(newUserWithRole);

      await verifyUserRepo.delete({ id: verifyUser.id });

      return newUser;
    });
  }

  async resendVerificationEmail(email: string) {
    const verifyUser = await this.verifyUserRepository.findOne({
      where: { email },
    });

    if (!verifyUser) {
      throw new NotFoundException('Token não encontrado');
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date();

    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    return this.verifyUserRepository.update(verifyUser.id, {
      token,
      expiresAt,
    });
  }

  async listUsers(page?: number, size?: number, filters?: UserFiltersDto) {
    const paginator = new Paginator(this.usersRepository);

    const query = this.applyFilters(
      this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role'),
      filters,
    );

    const paginatedQuery = await paginator.paginate(page, size, query);

    return paginatedQuery;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
