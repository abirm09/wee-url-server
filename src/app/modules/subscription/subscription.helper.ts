import { BillingType } from "@prisma/client";
import httpStatus from "http-status";
import { ApiError } from "../../../errorHandlers";
import { TPrismaClientInstance } from "../../../types/prisma/TPrismaClientInstance";
import { Logger } from "../../../utilities";
import { PaymentInput } from "../payment/payment.types";
import {
  TCalculateSubscriptionAmount,
  TCreateSubscription,
} from "./subscription.types";

const calculateSubscriptionAmount = async (
  params: TCalculateSubscriptionAmount
) => {
  const { planId, billingPeriodId, coupon, prisma, user } = params;

  const planData = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
    select: {
      type: true,
      billingPeriods: {
        where: {
          id: billingPeriodId,
        },
        select: {
          price: true,
          periodType: true,
        },
      },
    },
  });

  if (!planData) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid planID.");
  const billingPeriod = planData?.billingPeriods[0];
  if (!billingPeriod)
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid billing periodID.");

  let userData;
  if (user) {
    userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        subscriptions: {
          where: {
            expiresAt: { gte: new Date().toISOString() },
            isActive: true,
          },
          select: {
            plan: {
              select: {
                type: true,
              },
            },
            expiresAt: true,
            createdAt: true,
            request: {
              select: {
                finalCost: true,
              },
            },
          },
        },
        userCredit: {
          select: {
            balance: true,
          },
        },
      },
    });
  }

  // Handle coupon
  let couponData;
  if (coupon) {
    couponData = await prisma.coupon.findUnique({
      where: {
        code: coupon,
        expiryDate: { gte: new Date().toISOString() },
        isActive: true,
      },
      select: {
        id: true,
        allowedSubscriptions: true,
        discountAmount: true,
        discountPercent: true,
        maxRedemptions: true,
        currentRedemptions: true,
      },
    });
    if (!couponData)
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid coupon.");

    if ((couponData?.allowedSubscriptions || []).length > 0) {
      const isCouponAllowed = couponData.allowedSubscriptions.includes(
        planData?.type
      );
      if (!isCouponAllowed)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Applied coupon is not available for ${planData?.type} plan.`
        );

      if (
        couponData?.maxRedemptions &&
        couponData.maxRedemptions >= couponData.currentRedemptions
      )
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Applied coupon has reached its max redemptions."
        );
    }
  }

  const userPrevSubscription = userData?.subscriptions?.length
    ? (userData?.subscriptions || [])[0]?.plan?.type !== "free"
      ? userData?.subscriptions[0]
      : null
    : null;

  let remainingAmountFromPrevSub = 0;
  if (userPrevSubscription && userPrevSubscription?.expiresAt) {
    const prevSubStartedAt = new Date(userPrevSubscription?.createdAt);
    const prevSubExpiresAt = new Date(userPrevSubscription?.expiresAt);
    const today = new Date();

    const prevSubDurationInTime =
      prevSubExpiresAt.getTime() - prevSubStartedAt.getTime();

    const prevSubDurationInDays = Math.floor(
      prevSubDurationInTime / (1000 * 60 * 60 * 24)
    );

    const remainingSubscriptionInTimes =
      prevSubExpiresAt.getTime() - today.getTime();
    const remainingSubscriptionInDays = Math.floor(
      remainingSubscriptionInTimes / (1000 * 60 * 60 * 24)
    );

    const costPerDayForPrevSub =
      Number(userPrevSubscription?.request?.finalCost || "0") /
      prevSubDurationInDays;

    remainingAmountFromPrevSub =
      remainingSubscriptionInDays * costPerDayForPrevSub;
  }

  let originalCost = 0;
  originalCost =
    billingPeriod.periodType === "monthly"
      ? billingPeriod.price || 0
      : billingPeriod.periodType === "sixMonth"
        ? Number(billingPeriod.price || 0) * 6
        : Number(billingPeriod.price || 0) * 12;

  const initialUserCredit = userData?.userCredit?.balance || 0;

  let discountAmount = 0;
  if (couponData) {
    if (couponData.discountPercent) {
      discountAmount = originalCost * (couponData.discountPercent / 100);
    } else if (couponData.discountAmount) {
      discountAmount = couponData.discountAmount;
    }
  }

  const costAfterDiscount = Number((originalCost - discountAmount).toFixed(2));

  let remainingPayableAmount = costAfterDiscount;
  let remainingUserCredit = initialUserCredit;
  let usedPrevSubscriptionCredit = 0;
  let usedUserCredit = 0;
  let userNewCreditRemarks;

  // Apply previous subscription credit first
  if (remainingAmountFromPrevSub) {
    remainingPayableAmount -= remainingAmountFromPrevSub;
    usedPrevSubscriptionCredit = Math.min(
      costAfterDiscount,
      remainingAmountFromPrevSub
    );

    if (remainingPayableAmount <= 0) {
      remainingPayableAmount = 0;
      remainingUserCredit = initialUserCredit;
    }
  }

  // Apply user credit next
  if (remainingPayableAmount > 0 && initialUserCredit) {
    remainingPayableAmount -= initialUserCredit;
    usedUserCredit = Math.min(
      costAfterDiscount - usedPrevSubscriptionCredit,
      initialUserCredit
    );
    remainingUserCredit = Math.max(0, initialUserCredit - usedUserCredit);

    if (remainingPayableAmount <= 0) {
      remainingPayableAmount = 0;
    }
  }

  if (remainingAmountFromPrevSub) {
    remainingUserCredit += remainingAmountFromPrevSub;
  }

  return {
    originalCost,
    discountAmount,
    finalCost: costAfterDiscount,
    usedPrevSubscriptionCredit,
    usedUserCredit,
    remainingUserCredit,
    remainingPayableAmount,
    userId: user?.userId,
    planId,
    billingPeriodId,
    userNewCreditRemarks,
    couponId: couponData?.id,
  };
};

const getSubscriptionDates = (period: BillingType) => {
  const now = new Date();
  const endDate = new Date(now);

  switch (period) {
    case "monthly":
      endDate.setMonth(now.getMonth() + 1);
      break;
    case "sixMonth":
      endDate.setMonth(now.getMonth() + 6);
      break;
    case "yearly":
      endDate.setFullYear(now.getFullYear() + 1);
      break;
  }

  const startDate = now;
  endDate.setHours(23, 59, 59, 999); // Set the end date to the end of the day
  const endDateObj = endDate;

  return { startedAt: startDate, expiresAt: endDateObj };
};

const createSubscription = async (
  payload: TCreateSubscription,
  prisma: TPrismaClientInstance
) => {
  const {
    paymentIntent,
    transactionId,
    cardBrand,
    cardLast4,
    receiptUrl,
    paymentProvider,
  } = payload;

  let subscriptionReqData;
  if (paymentIntent) {
    subscriptionReqData = await prisma.subscriptionRequest.findFirst({
      where: {
        stripeIntentId: paymentIntent,
        status: "pending",
      },
      select: {
        id: true,
        billingPeriod: {
          select: {
            periodType: true,
          },
        },
        userId: true,
        remainingUserCredit: true,
        planId: true,
      },
    });
  }

  if (!subscriptionReqData) {
    Logger.console.info(
      `Failed to find subscription request with ${paymentIntent ? "paymentIntent" : ""}=${paymentIntent}`
    );
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid request");
  }

  const { userId, planId, id: reqId } = subscriptionReqData;

  await prisma.subscription.updateMany({
    where: {
      userId: userId,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  const { startedAt, expiresAt } = getSubscriptionDates(
    subscriptionReqData.billingPeriod.periodType
  );

  const paymentData: PaymentInput = {
    userId,
    transactionId,
    cardBrand,
    cardLast4,
    receiptUrl,
    paymentProvider,
  };

  const payment = await prisma.payment.create({
    data: paymentData,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionData: any = {
    userId,
    planId,
    reqId,
    startedAt,
    expiresAt,
    paymentId: payment.id,
  };

  await prisma.subscription.create({ data: subscriptionData });
  await prisma.subscriptionRequest.update({
    where: {
      id: subscriptionReqData.id,
    },
    data: {
      status: "completed",
    },
  });

  if (
    subscriptionReqData.remainingUserCredit !== undefined &&
    subscriptionReqData.remainingUserCredit !== null
  ) {
    await prisma.userCredit.update({
      where: {
        userId: subscriptionReqData.userId,
      },
      data: {
        balance: subscriptionReqData.remainingUserCredit,
      },
    });
  }
};

export const SubscriptionHelper = {
  calculateSubscriptionAmount,
  createSubscription,
  getSubscriptionDates,
};
