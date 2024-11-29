import { PaymentProvider } from "@prisma/client";
import { TJWTPayload } from "../../../types";
import { TPrismaClientInstance } from "../../../types/prisma/TPrismaClientInstance";

export type TCalculateSubscriptionAmount = {
  planId: string;
  billingPeriodId: string;
  coupon?: string;
  prisma: TPrismaClientInstance;
  user?: TJWTPayload;
  paymentProvider?: PaymentProvider;
};

export type TCreateSubscription = {
  cardBrand: string | null;
  cardLast4: string | null;
  transactionId: string;
  receiptUrl: string | null;
  paymentProvider: PaymentProvider;
  paymentIntent: string | null;
};
