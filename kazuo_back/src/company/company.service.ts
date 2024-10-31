import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyRepository } from './company.repository';
import { CreateCompanyDto } from './company.dto';
import { Company } from '../Entities/company.entity';
import { UsersService } from '../modules/users/users.service';
import { Repository } from 'typeorm';
import { Users } from 'src/Entities/users.entity';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly usersService: UsersService,
  ) {}

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { userId } = createCompanyDto;

    const user = await this.usersService.getUserById(userId);
    if (!user) {
        throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    const newCompany = await this.companyRepository.create({
        ...createCompanyDto,
        createdAt: new Date(),
    });
    
    
    newCompany.users = [user];
    
   
    await this.companyRepository.save(newCompany);

    return newCompany;
}

  async addUserToCompany(userEmail: string, companyId: string): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['users'],
    });

    if (!company) {
      throw new Error('Compañía no encontrada');
    }

    
    if (!company.users.some((user) => user.email === userEmail)) {
      const user = await this.usersService.getUserByEmail(userEmail);
      if (user) {
        company.users.push(user); 
        await this.companyRepository.save(company);
      } else {
        throw new NotFoundException('Usuario no encontrado');
      }
    } else {
      throw new ConflictException('El usuario ya está en la compañía');
    }
  }
}
