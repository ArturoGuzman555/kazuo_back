import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; // Importar el UsersModule
import { MailService } from 'src/mail/mail.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, JwtModule.register({})], // Asegúrate de que UsersModule está aquí
  providers: [AuthService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
