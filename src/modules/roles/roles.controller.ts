import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { Strategies } from 'src/helpers/constants/auth-strategies';
import { PageQueryDto } from 'src/helpers/pagination/dto/page-query.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Papéis')
@Controller('roles')
@UseGuards(AuthGuard(Strategies.JWT))
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  findAll(@Query() { page, size }: PageQueryDto) {
    return this.rolesService.findAll(page, size);
  }

  @Post()
  create(@Body() role: any) {
    return this.rolesService.create(role);
  }

  @Patch(':roleId')
  update(@Body() partialRole: any, @Param('roleId') roleId: string) {
    return this.rolesService.update(partialRole, roleId);
  }

  @Delete(':roleId')
  delete(@Param('roleId') roleId: string) {
    return this.rolesService.delete(roleId);
  }
}
