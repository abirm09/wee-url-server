import { Request, Response } from "express";
import { SubscriptionService } from "../../app/modules/subscription/subscription.service";
import config from "../../config";
import stripe from "../../config/stripe";
import catchAsync from "../../shared/catchAsync";
import { logger } from "../../utilities/logger/logger";

export const StripeWebHook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe.stripe_endpoint_secret
    );
  } catch (error) {
    const err = error as Error;
    logger.console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    logger.console.info("PaymentIntent was successful:", paymentIntent.id);
  }

  if (event.type === "charge.succeeded") {
    await SubscriptionService.processChargeSucceeded(event);
  }

  res.status(200).json({ received: true });
  return;
});
