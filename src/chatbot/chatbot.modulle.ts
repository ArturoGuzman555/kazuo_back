import { Module } from '@nestjs/common';
import { ChatBotController } from './chatbot.controller';
import { ChatBotService } from './chatbot.service';
import { CompanyService } from 'src/company/company.service';
import { ProductService } from 'src/modules/product/product.service';
import { CompanyModule } from 'src/company/company.module';
import { ProductModule } from 'src/modules/product/product.module';


@Module({
    imports: [CompanyModule, ProductModule],
  controllers: [ChatBotController],
  providers: [ChatBotService],
})
export class ChatbotModule {}
