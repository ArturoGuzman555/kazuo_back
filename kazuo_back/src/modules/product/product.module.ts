import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/Entities/product.entity';
import { Category } from 'src/Entities/category.entity';
import { StoreModule } from '../store/store.module';
import { Store } from 'src/Entities/store.entity';
import { StoreRepository } from '../store/store.repository';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Store]),
    MailModule,
    UsersModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, StoreRepository],
  exports: [ProductService],
})
export class ProductModule {}
