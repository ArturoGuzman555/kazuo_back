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

  async createCheckoutSession(priceId: string) {
    return this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://sdq9hdq4-3001.brs.devtunnels.ms/GestionInventario',
      cancel_url: 'https://sdq9hdq4-3001.brs.devtunnels.ms/Planes',
    });
  }

  // Nuevo método constructEvent para manejar el webhook
  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET // asegúrate de definir esta variable en el entorno
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    console.log('Pago completado para sesión:', session.id);
    // Lógica adicional para manejar la sesión completada
  }
}
