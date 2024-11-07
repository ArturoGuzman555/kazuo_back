import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyRepository } from './company.repository';
import { CreateCompanyDto, UpdateCompanyDto } from './company.dto';
import { Company } from '../Entities/company.entity';
import { UsersService } from '../modules/users/users.service';
import { Repository } from 'typeorm';
import { Users } from 'src/Entities/users.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async getAllCompanies(): Promise<Company[]> {
    return this.companyRepository.find({ relations: ['users'] });
  }

  async updateCompany(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException(`Compañía con id ${companyId} no encontrada`);
    }

    Object.assign(company, updateCompanyDto);

    return this.companyRepository.save(company);
  }

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { userId } = createCompanyDto;

    const existingCompanies = await this.companyRepository.find({
      where: { users: { id: userId } },
    });

    if (existingCompanies.length > 0) {
      throw new ConflictException(
        'El usuario ya tiene una compañía registrada.',
      );
    }

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    const newCompany = this.companyRepository.create({
      ...createCompanyDto,
      createdAt: new Date(),
    });
    newCompany.users = [user];

    await this.companyRepository.save(newCompany);
    return newCompany;
  }

  async getCompaniesByUserId(userId: string): Promise<Company[]> {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    return this.companyRepository.find({
      where: { users: { id: userId } },
    });
  }

  async getCompaniesById(userId: string): Promise<Company[]> {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    return this.companyRepository.find({
      where: { users: { id: userId } },
    });
  }

  async getCompanyById(companyId: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['users'], 
    });
  
    if (!company) {
      throw new NotFoundException(`Compañía con id ${companyId} no encontrada`);
    }
  
    return company;
  }

  async addUserToCompany(userEmail: string, companyId: string): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['users'],
    });
  
    if (!company) {
      console.log('Error: Compañía no encontrada');
      throw new NotFoundException('Compañía no encontrada');
    }
  
    if (!company.users.some((user) => user.email === userEmail)) {
      const user = await this.usersService.getUserByEmail(userEmail);
      if (user) {
        company.users.push(user);
        await this.companyRepository.save(company);
  
        console.log(`Usuario ${user.email} agregado a la compañía ${company.CompanyName} exitosamente.`);
        
        await this.mailService.sendMail(
          user.email,
          'Fuiste agregado a una Compañía',
          `Hola ${user.name}, te informamos que has sido agregado a la compañía ${company.CompanyName}.`,
        );
  
        await this.mailService.sendMail(
          company.email,
          'Nuevo usuario agregado a tu Compañía',
          `Hola, te informamos que el usuario ${user.name} (${user.email}) ha sido agregado a tu compañía ${company.CompanyName}.`,
        );
      } else {
        console.log(`El usuario con email ${userEmail} no existe en el sistema. Se enviará una invitación a registrarse.`);
        
        await this.mailService.sendMail(
          userEmail,
          'Invitación a registrarte',
          `Hola, hemos recibido una solicitud para que te unas a la compañía ${company.CompanyName}. Por favor, regístrate en nuestro sitio para poder agregarte.`,
        );
      }
    } else {
      console.log(`El usuario con email ${userEmail} ya está en la compañía ${company.CompanyName}.`);
      throw new ConflictException('El usuario ya está en la compañía');
    }
  }

  async storesByCompany(companyId: string) {
    const stores = await this.companyRepository.find({
      where: { id: companyId }, relations: {stores: {category : true}},
    });
    if (!stores){
      throw new NotFoundException(`La compania con  id ${companyId} no fue encontrada`);
    }

    return stores
  }
  
}  