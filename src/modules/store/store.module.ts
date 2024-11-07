import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/Entities/store.entity';
import { Category } from 'src/Entities/category.entity';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Category]), CompanyModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports:[StoreService],
})
export class StoreModule {}
