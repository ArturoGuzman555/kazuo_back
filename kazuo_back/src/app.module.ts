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
import { PaymentModule } from './modules/stripe/payment.module';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    FileUploadModule,

    PaymentModule,
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
