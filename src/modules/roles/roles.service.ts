import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from 'src/database/entity/role.entity';
import { Paginator } from 'src/helpers/pagination/pagination';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  findAll(page?: number, size?: number) {
    const paginator = new Paginator<Role>(this.rolesRepository);

    return paginator.paginate(page, size);
  }

  create(role: any) {
    return this.rolesRepository.save(role);
  }

  async update(newData: any, roleId: string): Promise<Role> {
    const [existentRole] = await this.rolesRepository.findBy({
      id: In([roleId]),
    });

    Object.assign(existentRole, newData);

    const savedRole = await this.rolesRepository.save(existentRole);

    return savedRole;
  }

  async delete(roleId: string) {
    return this.rolesRepository.delete({ id: roleId });
  }
}
