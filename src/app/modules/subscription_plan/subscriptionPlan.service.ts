import { BillingPeriod, BillingType, SubscriptionPlan } from "@prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../../app";
import { ApiError } from "../../../errorHandlers";

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

const getAllFromDB = async () => {
  const result = await prisma.subscriptionPlan.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
      maxURLsAllowed: true,
      customURLSlug: true,
      APIAccess: true,
      bulkURLShortening: true,
      customURLRedirectRules: true,
      canSetExpiration: true,
      allowURLEditing: true,
      showAds: true,
      QRCode: true,
      customDomainAllowed: true,
      analyticsAccess: true,
      prioritySupport: true,
      brandingCustomization: true,
      geoTargetingEnabled: true,
      linkRotation: true,
      isPublic: true,
      isActive: true,
      billingPeriods: {
        select: {
          id: true,
          periodType: true,
          price: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const updateIntoDB = async (
  planId: string,
  subscriptionData: SubscriptionPlan,
  billingData: BillingPeriod[]
) => {
  return prisma.$transaction(async (tx) => {
    const previousData = await tx.subscriptionPlan.findUnique({
      where: {
        id: planId,
      },
      select: {
        name: true,
        type: true,
        billingPeriods: {
          select: {
            id: true,
            periodType: true,
          },
        },
      },
    });
    if (!previousData)
      throw new ApiError(httpStatus.BAD_REQUEST, "No subscription plan found");

    subscriptionData.id = planId;

    if (Object.keys(subscriptionData || []).length) {
      await tx.subscriptionPlan.update({
        where: { id: planId },
        data: subscriptionData,
      });
    }

    if (billingData.length > 0) {
      const currentBillingPeriods = new Map(
        previousData.billingPeriods.map((bp) => [bp.periodType, bp.id])
      );

      // Process each billing data input
      for (const billing of billingData) {
        if (currentBillingPeriods.has(billing.periodType)) {
          // Update existing billing period
          const id = currentBillingPeriods.get(billing.periodType);
          billing.id = id as unknown as string;
          await tx.billingPeriod.update({
            where: { id },
            data: billing,
          });
          currentBillingPeriods.delete(billing.periodType); // Mark as processed
        }
      }
    }
  });
};

export const SubscriptionPlanService = {
  createIntoDB,
  getAllFromDB,
  updateIntoDB,
};
