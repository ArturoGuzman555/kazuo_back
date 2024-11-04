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
      // Usa `req['rawBody']` en lugar de `request.body` para la verificación
      event = this.stripe.webhooks.constructEvent(
        request['rawBody'], // Cambiado a rawBody
        signature,
        webhookSecret,
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return response.status(400).send(`Webhook Error: ${error.message}`);
    }
  
    // Manejar eventos específicos
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await this.stripeService.handleCheckoutSessionCompleted(session);
        console.log('Checkout session completed:', session);
        break;
  
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice);
        break;
  
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent);
        break;
  
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    response.status(200).json({ received: true });
  }
}