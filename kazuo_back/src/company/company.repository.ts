import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/Entities/company.entity';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getById(id: string): Promise<Company | null> {
    return this.companyRepository.findOne({ where: { id } });
  }

  async createCompany(company: Partial<Company>): Promise<Company> {
    return this.companyRepository.save(company);
  }
}
