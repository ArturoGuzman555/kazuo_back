import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/Entities/users.entity';
import { UserRepository } from '../users/users.repository';
import { MailService } from 'src/mail/mail.service';


@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, MailService ],
})
export class AuthModule {}
