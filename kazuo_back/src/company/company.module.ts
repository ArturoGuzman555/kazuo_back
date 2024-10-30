import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from '../Entities/company.entity';
import { CompanyRepository } from './company.repository';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), UsersModule],
  providers: [CompanyService, CompanyRepository],
  controllers: [CompanyController],
})
export class CompanyModule {}