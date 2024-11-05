import { Module } from '@nestjs/common';
import { StripeService } from './payment.service';

import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeController } from './payment.controller';

@Module({
  controllers: [, StripeWebhookController],
  providers: [StripeService, StripeController],
})
export class StripeModule {}
