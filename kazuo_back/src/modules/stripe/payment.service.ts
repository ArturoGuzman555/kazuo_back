// import { Injectable } from '@nestjs/common';
// import stripe from 'src/config/stripe.config';

// @Injectable()
// export class PaymentService {
//   async createPaymentIntent(amount: number, currency: string) {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       payment_method_types: ['card'],
//     });

//     return paymentIntent;
//   }

//   async confirmPaymentIntent(paymentIntentId: string) {
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
//     await stripe.paymentIntents.confirm(paymentIntentId);

//     return paymentIntent;
//   }
// }


// payment.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-09-30.acacia',
    });
  }

  async createPaymentIntent(amount: number, currency: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount, // El monto en centavos, ej: $10 = 1000
        currency, // Por ejemplo, "usd"
      });
      return {
        clientSecret: paymentIntent.client_secret, // Se envía al frontend
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
