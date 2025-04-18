import { Subscription, UserCredit } from "@prisma/client";

export type TUserCreditInput = Omit<
  UserCredit,
  "id" | "createdAt" | "updatedAt"
>;

export type TSubscriptionInput = Omit<
  Subscription,
  "id" | "createdAt" | "updatedAt"
>;
