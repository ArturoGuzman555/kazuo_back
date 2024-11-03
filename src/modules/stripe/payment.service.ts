import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
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

  constructEvent(payload: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  }
}
