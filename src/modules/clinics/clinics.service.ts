import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinic } from 'src/database/entity/clinic.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { Repository } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { Address } from 'src/database/entity/address.entity';
import { ClinicContact } from 'src/database/entity/clinic-contact.entity';
import { Roles } from 'src/helpers/constants/roles';
import { hashSync } from 'bcrypt';
import { Role } from 'src/database/entity/role.entity';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
  ) {}

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

  async create(clinic: CreateClinicDto, user: User) {
    if (user.role.name !== Roles.SUPER_ADMIN) {
      throw new ForbiddenException('Usuário não autorizado');
    }

    return this.clinicsRepository.manager.transaction(async (manager) => {
      const clinicsRepo = manager.getRepository(Clinic);
      const addressesRepo = manager.getRepository(Address);
      const contactsRepo = manager.getRepository(ClinicContact);
      const usersRepo = manager.getRepository(User);
      const rolesRepo = manager.getRepository(Role);

      this.validatePassword(
        clinic.owner.password,
        clinic.owner.passwordConfirmation,
      );

      const emailExists = await usersRepo.findOne({
        where: {
          email: clinic.owner.email,
        },
      });

      if (emailExists) {
        throw new BadRequestException('Email já cadastrado');
      }

      const newUser = usersRepo.create(clinic.owner);

      newUser.passwordHash = hashSync(clinic.owner.password, 12);

      const role = await rolesRepo.findOne({
        where: {
          name: Roles.ADMIN,
        },
      });

      newUser.role = role;

      await usersRepo.save(newUser);

      if (clinic.address) {
        const address = addressesRepo.create(clinic.address);

        await addressesRepo.save(address);

        clinic.address = address;
      }

      const newClinic = clinicsRepo.create({
        ...clinic,
        owner: newUser,
      });

      await clinicsRepo.save(newClinic);

      if (clinic.contacts) {
        for (const { contact, type } of clinic.contacts) {
          const clinicContact = contactsRepo.create({
            contact,
            type,
            clinic: newClinic,
          });

          await contactsRepo.save(clinicContact);
        }
      }

      return newClinic;
    });
  }

  getClinicById(id: string) {
    return this.clinicsRepository.findOne({ where: { id } });
  }
}
