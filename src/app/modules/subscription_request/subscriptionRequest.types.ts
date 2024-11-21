import { SubscriptionRequest } from "@prisma/client";

export type SubscriptionRequestInput = Omit<
  SubscriptionRequest,
  "id" | "createdAt" | "updatedAt"
>;
