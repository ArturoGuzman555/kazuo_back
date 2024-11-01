// import { Injectable } from '@nestjs/common';
// import Stripe from 'stripe';

// @Injectable()
// export class StripeService {
//   private stripe: Stripe;

//   constructor() {
//     this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//       apiVersion: '2024-09-30.acacia',
//     });
//   }

//   async getPrices() {
//     const prices = await this.stripe.prices.list({
//       expand: ['data.product'],
//     });

//     return prices.data
//       .filter(
//         (price) =>
//           price.active &&
//           price.product &&
//           (price.product as Stripe.Product).active,
//       )
//       .sort((a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0));
//   }

//   async createCheckoutSession(priceId: string) {
//     const session = await this.stripe.checkout.sessions.create({
//       mode: 'subscription',
//       payment_method_types: ['card'],
//       line_items: [{ price: priceId, quantity: 1 }],
//       success_url: 'http://localhost:3000/GestionInventario',
//       cancel_url: 'http://localhost:3000/Planes',
//     });
//     return session.url;
//   }
// }

// stripe.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-09-30.acacia',
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
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  }
}
