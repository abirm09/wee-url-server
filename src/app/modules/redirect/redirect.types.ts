import { SubscriptionType } from "@prisma/client";

export type TRedirectURLData = {
  user: {
    subscriptions: {
      plan: {
        type: SubscriptionType;
      };
    }[];
  };
  fullUrl: string;
  id: string;
} | null;
