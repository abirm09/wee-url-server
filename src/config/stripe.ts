import stripe from "stripe";
import { env } from "./env";

export const Stripe = new stripe(env.stripe.stripe_secret_key);
