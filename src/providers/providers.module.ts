import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersService } from './providers.service';
import { Provider } from 'src/Entities/providers.entity';
import { Product } from 'src/Entities/product.entity';

import { Users } from 'src/Entities/users.entity';
import { UserRepository } from 'src/modules/users/users.repository';
import { UsersService } from 'src/modules/users/users.service';
import { UsersModule } from 'src/modules/users/users.module';
import { ProvidersRepository } from './providers.repository';
import { ProductModule } from 'src/modules/product/product.module';
import { ProvidersController } from './providers.contoller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provider, Product]),
    UsersModule,
    ProductModule,
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService, UsersService, ProvidersRepository],
  exports: [ProvidersService],
})
export class ProvidersModule {}
