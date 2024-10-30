import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from '../stripe/payment.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async createCheckoutSession(@Body('priceId') priceId: string) {
    const url = await this.stripeService.createCheckoutSession(priceId);
    return { url };
  }
}
