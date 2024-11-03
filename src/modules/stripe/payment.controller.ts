import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './payment.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  async createCheckoutSession(
    @Body() body: { priceId: string },
    @Res() res: Response,
  ) {
    try {
      const session = await this.stripeService.createCheckoutSession(body.priceId);
      return res.json({ url: session.url });
    } catch (error) {
      console.error('Error during Stripe session creation:', error);
      throw new HttpException(
        'Error creating Stripe session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    try {
      const event = this.stripeService.constructEvent(req.body, sig);
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Checkout completed for product ID:', session.metadata?.productId);
        // Aquí puedes guardar en la base de datos o enviar un correo de confirmación
      }
      res.sendStatus(200);
    } catch (err) {
      console.error('Webhook error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
