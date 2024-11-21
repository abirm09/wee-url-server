import { z } from "zod";

const calculateSubscriptionAmount = z.object({
  body: z.object({
    planId: z.string({ required_error: "Plan ID is required" }),
    billingPeriodId: z.string({
      required_error: "Billing period ID is required",
    }),
    coupon: z.string().optional(),
  }),
});

const createStripePaymentIntent = z.object({
  body: z.object({
    requestId: z.string({ required_error: "Request ID is required" }),
  }),
});

export const SubscriptionValidation = {
  calculateSubscriptionAmount,
  createStripePaymentIntent,
};
