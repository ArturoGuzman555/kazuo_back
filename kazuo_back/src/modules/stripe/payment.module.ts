import { Module } from '@nestjs/common';
import { PricesController } from './payment.controller';
import { StripeService } from './payment.service';

@Module({
  controllers: [PricesController],
  providers: [StripeService],
})
export class PaymentModule {}
