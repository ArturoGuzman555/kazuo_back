import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/Entities/users.entity';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from '../users/users.module';
import { CryptoService } from 'src/crypto/crypto.service';
import { UserRepository } from '../users/users.repository';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), MailModule, UsersModule, CompanyModule],
  controllers: [AuthController],
  providers: [AuthService, CryptoService, UserRepository],
})
export class AuthModule {}
