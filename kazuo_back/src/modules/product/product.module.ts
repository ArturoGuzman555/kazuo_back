import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/Entities/product.entity';
import { Category } from 'src/Entities/category.entity';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), StoreModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
