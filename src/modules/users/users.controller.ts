import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { PageQueryDto } from 'src/helpers/pagination/dto/page-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { Strategies } from 'src/helpers/constants/auth-strategies';
import { ApiTags } from '@nestjs/swagger';
import { VerifyUserDto } from './dto/verify-user.dto';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  generateToken(@Body() user: CreateUserDto) {
    return this.usersService.verifyUserAtCreation(user);
  }

  @Post('/verify')
  verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    return this.usersService.verifyUser(verifyUserDto);
  }

  @Post('/resend/:email')
  resendVerificationEmail(@Param('email') email: string) {
    return this.usersService.resendVerificationEmail(email);
  }

  @Get()
  @UseGuards(AuthGuard(Strategies.JWT))
  listUsers(
    @Query() { page, size }: PageQueryDto,
    @Query() filters: UserFiltersDto,
  ) {
    return this.usersService.listUsers(page, size, filters);
  }

  @Get('/:id')
  @UseGuards(AuthGuard(Strategies.JWT))
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
