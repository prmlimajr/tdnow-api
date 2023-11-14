import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/database/entity/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PRIVATE_KEY } from 'src/config/env';
import { JwtModule } from '@nestjs/jwt';
import { Clinic } from 'src/database/entity/clinic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Clinic]),
    PassportModule,
    JwtModule.register({
      secret: PRIVATE_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
