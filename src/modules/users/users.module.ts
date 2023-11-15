import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entity/user.entity';
import { Role } from 'src/database/entity/role.entity';
import { Clinic } from 'src/database/entity/clinic.entity';
import { VerifyUser } from 'src/database/entity/verify-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Clinic, VerifyUser])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
