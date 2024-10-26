import { Controller, Get } from '@nestjs/common';
import { StripeService } from './payment.service';

@Controller('prices')
export class PricesController {
  constructor(private readonly stripeService: StripeService) {}

  @Get()
  async getPrices() {
    const prices = await this.stripeService.getPrices();
    return prices;
  }
}