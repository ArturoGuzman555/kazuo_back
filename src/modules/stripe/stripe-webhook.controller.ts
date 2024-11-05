import { Controller, Post, Req, Res, Headers, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { StripeService } from './payment.service';

@Controller('stripe')
export class StripeWebhookController {
  private readonly stripe: Stripe;

  constructor(private readonly stripeService: StripeService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-10-28.acacia' });
  }

  @Post('webhook')
  async handleWebhook(
    @Req() request: Request,
    @Res() response: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;    

    try {
      // Simulación de una respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        event = { type: 'checkout.session.completed', data: { object: {} } } as Stripe.Event;
      } else {
        event = this.stripe.webhooks.constructEvent(request['rawBody'], signature, webhookSecret);
      }
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw new BadRequestException('Webhook signature verification failed');
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await this.stripeService.handleCheckoutSessionCompleted(session);
        console.log('Simulación de una sesión de checkout completada:', session);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.status(200).json({ received: true });
  }
}
