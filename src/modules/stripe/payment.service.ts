// stripe.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY debe ser proporcionada');
    }
    if (!process.env.FRONTEND_URL) {
      throw new Error('FRONTEND_URL debe ser proporcionada');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    });
  }

  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET debe ser proporcionada');
    }

    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      console.error('Error al verificar el evento del webhook:', err);
      throw new BadRequestException('Webhook Error: ' + err.message);
    }
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    // Aquí procesas la información del session, como el ID del cliente, etc.
    console.log('Pago completado para sesión:', session.id);

    // Aquí puedes manejar la lógica para actualizar el estado de la orden, notificar al usuario, etc.
  }
}
