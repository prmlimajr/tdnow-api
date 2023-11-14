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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
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

  async create(user: CreateUserDto): Promise<User> {
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

    const newUser = this.usersRepository.create(user);

    newUser.passwordHash = hashSync(user.password, 12);

    const newUserWithRole = await this.setUserRole(user, newUser);

    return this.usersRepository.save(newUserWithRole);
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
