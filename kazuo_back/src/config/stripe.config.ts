import { Stripe } from 'stripe';
import { config as configDotenv } from 'dotenv';

configDotenv({ path: '.development.env' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: null,
});

export default stripe;
