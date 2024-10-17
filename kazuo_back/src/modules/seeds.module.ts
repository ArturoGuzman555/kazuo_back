import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/Entities/category.entity';
import { CategoriesSeed } from './category/categories.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesSeed],
  exports: [CategoriesSeed],
})
export class SeedsModule {}
