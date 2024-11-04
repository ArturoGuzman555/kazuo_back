import { Module } from '@nestjs/common';

import { StripeService } from './payment.service';
import { StripeController } from './payment.controller';


@Module({
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}