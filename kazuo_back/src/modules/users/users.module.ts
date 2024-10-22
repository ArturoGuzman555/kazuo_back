import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/Entities/users.entity';
import { UserRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Users])], // Importar la entidad
  providers: [UserRepository],
  exports: [UserRepository], // Exportar el repositorio para usarlo en otros módulos
})
export class UsersModule {}

