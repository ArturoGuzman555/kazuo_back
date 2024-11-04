// import { Injectable } from '@nestjs/common';
// import Stripe from 'stripe';

// @Injectable()
// export class StripeService {
//   private stripe: Stripe;

//   constructor() {
//     this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//       apiVersion: '2024-09-30.acacia',
//     });
//   }

//   async createCheckoutSession(priceId: string) {
//     return this.stripe.checkout.sessions.create({
//       mode: 'subscription',
//       payment_method_types: ['card'],
//       line_items: [{ price: priceId, quantity: 1 }],
//       success_url: `${process.env.FRONTEND_URL}/GestionInventario`,
//       cancel_url: `${process.env.FRONTEND_URL}/Planes`,
//     });
//   }

//   constructEvent(payload: Buffer, signature: string) {
//     return this.stripe.webhooks.constructEvent(
//       payload,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET,
//     );
//   }
// }
















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
      apiVersion: "2024-10-28.acacia",
    });
  }

  async getPrices() {
    try {
      const prices = await this.stripe.prices.list({
        active: true,
        expand: ['data.product'],
      });

      const activePrices = prices.data.filter(
        (price) => price.active && price.product && (price.product as Stripe.Product).active
      );

      return activePrices.map((price) => ({
        id: price.id,
        nickname: price.nickname || 'Plan',
        unit_amount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval,
      }));
    } catch (error) {
      console.error('Error al obtener los precios:', error);
      throw new BadRequestException(error.message || 'Error al obtener los precios');
    }
  }

  async createCheckoutSession(priceId: string) {
    console.log('Creando sesión de checkout para priceId:', priceId);
    if (!priceId) {
      throw new BadRequestException('Se requiere el ID del precio');
    }

    try {
      // Verificar que el precio esté activo y su producto también
      const price = await this.stripe.prices.retrieve(priceId, {
        expand: ['product'],
      });

      if (!price.active || !(price.product as Stripe.Product).active) {
        throw new BadRequestException('El precio o el producto asociado no está activo');
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/planes`,
      });

      console.log('Sesión de checkout creada:', session.id);
      return { url: session.url };
    } catch (error) {
      console.error('Error al crear la sesión de checkout:', error);
      throw new BadRequestException(error.message || 'Error al crear la sesión de checkout');
    }
  }
}