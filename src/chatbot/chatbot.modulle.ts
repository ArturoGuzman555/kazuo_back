import { Module } from '@nestjs/common';
import { ChatBotController } from './chatbot.controller';
import { ChatBotService } from './chatbot.service';
import { CompanyService } from 'src/company/company.service';
import { ProductService } from 'src/modules/product/product.service';
import { CompanyModule } from 'src/company/company.module';
import { ProductModule } from 'src/modules/product/product.module';
import { StoreModule } from 'src/modules/store/store.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [CompanyModule, ProductModule, StoreModule, CategoryModule, UsersModule],
  controllers: [ChatBotController],
  providers: [ChatBotService],
})
export class ChatbotModule {}
