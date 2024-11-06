import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from './payment.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('prices')
  async getPrices() {
    return this.stripeService.getPrices();
  }

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body('priceId') priceId: string,
    @Body('userEmail') userEmail: string, 
  ) {
    if (!priceId || !userEmail) {
      throw new BadRequestException('priceId y userEmail son requeridos');
    }

    return this.stripeService.createCheckoutSession(priceId, userEmail);
  }
}
