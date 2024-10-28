import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/Entities/product.entity';
import { Category } from 'src/Entities/category.entity';
import { StoreModule } from '../store/store.module';
import { Store } from 'src/Entities/store.entity';
import { StoreRepository } from '../store/store.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Store])],
  controllers: [ProductController],
  providers: [ProductService, StoreRepository],
})
export class ProductModule {}
