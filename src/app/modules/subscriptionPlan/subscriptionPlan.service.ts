import { BillingPeriod, BillingType, SubscriptionPlan } from "@prisma/client";
import { prisma } from "../../../app";

const createIntoDB = async (
  subscriptionData: SubscriptionPlan,
  billingData: BillingPeriod[]
) => {
  return prisma.$transaction(async (tx) => {
    const subscriptionPlanData = await tx.subscriptionPlan.create({
      data: subscriptionData,
    });

    // Define all possible billing types with default values
    const allBillingTypes = [
      {
        planId: subscriptionPlanData.id,
        periodType: BillingType.monthly,
      },
      {
        planId: subscriptionPlanData.id,
        periodType: BillingType.sixMonth,
      },
      {
        planId: subscriptionPlanData.id,
        periodType: BillingType.yearly,
      },
    ];

    // Replace missing types with default values
    const mergedBillingData = allBillingTypes.map((defaultPeriod) => {
      const userProvidedPeriod = billingData.find(
        (item) => item.periodType === defaultPeriod.periodType
      );
      return userProvidedPeriod
        ? { ...defaultPeriod, ...userProvidedPeriod }
        : defaultPeriod;
    });

    // Create billing periods in bulk
    await tx.billingPeriod.createMany({
      data: mergedBillingData,
    });

    return subscriptionPlanData;
  });
};

export const SubscriptionPlanService = {
  createIntoDB,
};
