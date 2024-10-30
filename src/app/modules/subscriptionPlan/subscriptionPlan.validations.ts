import { z } from "zod";
import { SubscriptionPlanConst } from "./subscriptionPlan.const";

const create = z.object({
  body: z.object({
    subscriptionData: z.object(
      {
        name: z
          .string({ required_error: "Plan name is required" })
          .min(3, { message: "Plan name is required." })
          .max(100, { message: "Plan name cannot exceed 100 characters." }),
        type: z.enum(
          [...SubscriptionPlanConst.subscriptionType] as [string, ...string[]],
          { required_error: "Plan type is required" }
        ),
        description: z.string().optional(),
        maxURLsAllowed: z
          .number()
          .int({ message: "Max URLs allowed must be an integer." })
          .nonnegative({ message: "Max URLs allowed cannot be negative." })
          .default(5)
          .optional(),
        customURLSlug: z.boolean().default(false),
        APIAccess: z.boolean().default(false),
        bulkURLShortening: z.boolean().default(false),
        customURLRedirectRules: z.boolean().default(false),
        canSetExpiration: z.boolean().default(false),
        allowURLEditing: z.boolean().default(false),
        showAds: z.boolean().default(true),
        QRCode: z.boolean().default(false),
        customDomainAllowed: z.boolean().default(false),
        analyticsAccess: z.boolean().default(false),
        prioritySupport: z.boolean().default(false),
        brandingCustomization: z.boolean().default(false),
        geoTargetingEnabled: z.boolean().default(false),
        linkRotation: z.boolean().default(false),
        isPublic: z.boolean().default(true),
        isActive: z.boolean().default(true),
      },
      { required_error: "Subscription data is required" }
    ),
    billingData: z
      .object(
        {
          periodType: z.enum([...SubscriptionPlanConst.billingPeriodEnum] as [
            string,
            ...string[],
          ]),
          price: z.number().min(0.2).max(50).default(0).optional(),
        },
        { required_error: "Billing data is required" }
      )
      .array(),
  }),
});

export const SubscriptionPlanValidation = {
  create,
};
