import {
  Controller,
  Post,
  Req,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './payment.service';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    try {
      const event = this.stripeService.constructEvent(req.body, sig);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.stripeService.handleCheckoutSessionCompleted(session);
      }

      res.sendStatus(200);
    } catch (err) {
      console.error('Error en el webhook:', err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}
