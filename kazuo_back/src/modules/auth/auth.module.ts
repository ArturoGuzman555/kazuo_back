import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/Entities/users.entity';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from '../users/users.module';
import { CryptoService } from 'src/crypto/crypto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), MailModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, CryptoService],
})
export class AuthModule {}
