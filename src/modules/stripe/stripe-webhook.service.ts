import { Module } from '@nestjs/common';
import { StripeService } from './payment.service';
import { StripeController } from './payment.controller';
import { StripeWebhookController } from './stripe-webhook.controller'; // Importa el controlador de webhook

@Module({
  controllers: [StripeController, StripeWebhookController],
  providers: [StripeService],
})
export class StripeModule {}