import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { UsersModule } from './modules/users/users.module';
import { CategoryModule } from './modules/category/category.module';
import { SeedsModule } from './modules/seeds.module';
// import { PaymentModule, StripeModule } from './modules/stripe/payment.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { CompanyModule } from './company/company.module';
import { ProvidersModule } from './providers/providers.module';
import { InformesModule } from './modules/informes/informes.module';
import { StripeModule } from './modules/stripe/payment.module';
import { ChatbotModule } from './chatbot/chatbot.modulle';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    FileUploadModule,
    WebsocketModule,
    CompanyModule,
    ProvidersModule,
    InformesModule,
    ChatbotModule,

    StripeModule,
    SeedsModule,

    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
