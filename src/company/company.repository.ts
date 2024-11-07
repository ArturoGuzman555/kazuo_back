  import { ConflictException, Injectable } from '@nestjs/common';
  import { DataSource, Repository } from 'typeorm';
  import { Company } from 'src/Entities/company.entity';

  @Injectable()
  export class CompanyRepository extends Repository<Company> {
    constructor(private dataSource: DataSource) {
      super(Company, dataSource.createEntityManager());
    }

    async createCompany(company: Partial<Company>): Promise<Company> {
      return this.save(company);
    }

    async addUserToCompany(userId: string, companyId: string): Promise<void> {
      const company = await this.findOne({
        where: { id: companyId },
        relations: ['users'],
      });
      if (!company) {
        throw new Error('Compañía no encontrada');
      }

      if (!company.users) {
        company.users = [];
      }
      if (!company.users.some((user) => user.id === userId)) {
        company.users.push({ id: userId } as any);
        await this.save(company);
      } else {
        throw new ConflictException('El usuario ya está en la compañía');
      }
    }
  }
