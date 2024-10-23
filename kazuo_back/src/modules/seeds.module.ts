import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/Entities/category.entity';
import { CategoriesSeed } from './category/categories.seed';
import { UsersModule } from './users/users.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), UsersModule, StoreModule],
  providers: [CategoriesSeed],
  exports: [CategoriesSeed],
})
export class SeedsModule {}
