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

<<<<<<< HEAD
  async createCheckoutSession(priceId: string) {
    return this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://sdq9hdq4-3001.brs.devtunnels.ms/GestionInventario',
      cancel_url: 'https://sdq9hdq4-3001.brs.devtunnels.ms/Planes',
    });
  }
=======
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
>>>>>>> 8584ec0535e7ee06a3eedef7373bc6cc828b276b

  // Nuevo método constructEvent para manejar el webhook
  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    try {
<<<<<<< HEAD
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
=======
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
>>>>>>> 8584ec0535e7ee06a3eedef7373bc6cc828b276b
