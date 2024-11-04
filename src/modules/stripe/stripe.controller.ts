import { Controller, Get, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('prices')
  async getPrices() {
    return this.stripeService.getPrices();
  }

  @Post('checkout')
  async createCheckoutSession(@Body('priceId') priceId: string) {
    return this.stripeService.createCheckoutSession(priceId);
  }
}