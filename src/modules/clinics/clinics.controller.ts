import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { AuthGuard } from '@nestjs/passport';
import { Strategies } from 'src/helpers/constants/auth-strategies';
import { ApiTags } from '@nestjs/swagger';
import { LoggedUser } from '../auth/logged-user.decorator';
import { User } from 'src/database/entity/user.entity';

@ApiTags('Clinicas')
@Controller('clinics')
export class ClinicsController {
  constructor(private clinicsService: ClinicsService) {}

  @Post()
  @UseGuards(AuthGuard(Strategies.JWT))
  create(@Body() clinic: CreateClinicDto, @LoggedUser() user: User) {
    return this.clinicsService.create(clinic, user);
  }

  @Get('/:id')
  getClinicById(@Param('id') id: string) {
    return this.clinicsService.getClinicById(id);
  }
}
