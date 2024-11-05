import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { StripeService } from './payment.service';

@Controller('stripe')
export class StripeWebhookController {
  private readonly stripe: Stripe;

  constructor(private readonly stripeService: StripeService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    });
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
      // Intenta verificar el evento usando el webhook secret y el signature
      event = this.stripe.webhooks.constructEvent(
        request['rawBody'],
        signature,
        webhookSecret,
      );
    } catch (error) {
      console.error('Error de verificación de la firma del webhook:', error);
      // Si falla la verificación, envía una respuesta 400
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send('Webhook signature verification failed');
    }
    response.status(200).json({ received: true });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.stripeService.handleCheckoutSessionCompleted(session);
    }

    // Responde a Stripe confirmando que se recibió el evento
    response.status(HttpStatus.OK).send({ received: true });
  }
}
