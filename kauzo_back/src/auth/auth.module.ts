import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/Entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
