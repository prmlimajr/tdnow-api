import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';
import { setLoggedUser } from 'src/config/hooks';
import { PRIVATE_KEY } from 'src/config/env';
import { Clinic } from 'src/database/entity/clinic.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: PRIVATE_KEY,
    });
  }

  async validate(payload: JwtPayloadDto) {
    const userId = payload.sub;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    const clinic = await this.clinicsRepository.findOne({
      where: { owner: { id: userId } },
      relations: ['address', 'contacts'],
    });

    user.clinic = clinic;

    if (!user) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }

    setLoggedUser(user);

    return user;
  }
}
