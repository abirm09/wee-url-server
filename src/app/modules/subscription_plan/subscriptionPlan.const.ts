import { BillingType, SubscriptionType } from "@prisma/client";

const billingPeriodEnum: BillingType[] = ["monthly", "sixMonth", "yearly"];

const subscriptionType: SubscriptionType[] = [
  "free",
  "starter",
  "premium",
  "business",
];

export const SubscriptionPlanConst = {
  billingPeriodEnum,
  subscriptionType,
};
