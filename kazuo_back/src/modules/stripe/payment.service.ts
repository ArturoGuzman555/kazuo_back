import { Injectable } from '@nestjs/common';
import stripe from 'src/config/stripe.config';

@Injectable()
export class PaymentService {
  async createPaymentIntent(amount: number, currency: string) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });

    return paymentIntent;
  }

  async confirmPaymentIntent(paymentIntentId: string) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    await stripe.paymentIntents.confirm(paymentIntentId);

    return paymentIntent;
  }
}
