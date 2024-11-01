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

const update = z.object({
  body: z.object({
    subscriptionData: z
      .object(
        {
          name: z
            .string()
            .min(3, { message: "Plan name is required." })
            .max(100, { message: "Plan name cannot exceed 100 characters." })
            .optional(),
          type: z
            .enum(
              [...SubscriptionPlanConst.subscriptionType] as [
                string,
                ...string[],
              ],
              { required_error: "Plan type is required" }
            )
            .optional(),
          description: z.string().optional(),
          maxURLsAllowed: z
            .number()
            .int({ message: "Max URLs allowed must be an integer." })
            .nonnegative({ message: "Max URLs allowed cannot be negative." })
            .default(5)
            .optional(),
          customURLSlug: z.boolean().optional(),
          APIAccess: z.boolean().optional(),
          bulkURLShortening: z.boolean().optional(),
          customURLRedirectRules: z.boolean().optional(),
          canSetExpiration: z.boolean().optional(),
          allowURLEditing: z.boolean().optional(),
          showAds: z.boolean().optional(),
          QRCode: z.boolean().optional(),
          customDomainAllowed: z.boolean().optional(),
          analyticsAccess: z.boolean().optional(),
          prioritySupport: z.boolean().optional(),
          brandingCustomization: z.boolean().optional(),
          geoTargetingEnabled: z.boolean().optional(),
          linkRotation: z.boolean().optional(),
          isPublic: z.boolean().optional(),
          isActive: z.boolean().optional(),
        },
        { required_error: "Subscription data is required" }
      )
      .optional(),
    billingData: z
      .object(
        {
          periodType: z
            .enum([...SubscriptionPlanConst.billingPeriodEnum] as [
              string,
              ...string[],
            ])
            .optional(),
          price: z.number().min(0.2).max(50).default(0).optional(),
        },
        { required_error: "Billing data is required" }
      )
      .array()
      .optional(),
  }),
});

export const SubscriptionPlanValidation = {
  create,
  update,
};
