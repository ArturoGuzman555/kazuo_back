// import { Module } from '@nestjs/common';
// import { PricesController } from './payment.controller';
// import { StripeService } from './payment.service';

// @Module({
//   controllers: [PricesController],
//   providers: [StripeService],
// })
// export class PaymentModule {}


// stripe.module.ts
import { Module } from '@nestjs/common';
import { StripeController } from './payment.controller';
import { StripeService } from './payment.service';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
