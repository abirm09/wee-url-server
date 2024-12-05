import httpStatus from "http-status";
import { prisma } from "../../../app";
import { Stripe } from "../../../config";
import { ApiError } from "../../../errorHandlers";
import { TJWTPayload } from "../../../types";
import { Logger } from "../../../utilities";
import { SubscriptionRequestInput } from "../subscription_request/subscriptionRequest.types";
import { SubscriptionHelper } from "./subscription.helper";
import { TCreateSubscription } from "./subscription.types";

const calculateSubscriptionAmount = async (
  planId: string,
  billingPeriodId: string,
  coupon: string,
  user?: TJWTPayload
) => {
  return prisma.$transaction(async (tx) => {
    const {
      originalCost,
      discountAmount,
      finalCost,
      usedPrevSubscriptionCredit,
      usedUserCredit,
      remainingPayableAmount,
      remainingUserCredit,
    } = await SubscriptionHelper.calculateSubscriptionAmount({
      planId,
      billingPeriodId,
      prisma: tx,
      user,
      coupon,
      paymentProvider: "stripe",
    });
    return {
      originalCost,
      discountAmount,
      finalCost,
      usedPrevSubscriptionCredit,
      usedUserCredit,
      remainingPayableAmount,
      remainingUserCredit,
    };
  });
};

const createSubscriptionRequestIntoDB = async (
  planId: string,
  billingPeriodId: string,
  coupon: string,
  user: TJWTPayload
) => {
  return prisma.$transaction(async (tx) => {
    const {
      userId,
      couponId,
      originalCost,
      discountAmount,
      finalCost,
      usedUserCredit,
      remainingPayableAmount,
      remainingUserCredit,
      userNewCreditRemarks,
    } = await SubscriptionHelper.calculateSubscriptionAmount({
      planId,
      billingPeriodId,
      prisma: tx,
      user,
      coupon,
    });

    if (!userId) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid request");

    const subscriptionReqData: SubscriptionRequestInput = {
      userId,
      planId,
      billingPeriodId,
      couponId: couponId || null,
      userNewCreditRemarks: userNewCreditRemarks || null,
      originalCost,
      discountAmount,
      usedUserCredit,
      remainingUserCredit,
      remainingPayableAmount,
      finalCost,
      status: "pending",
      stripeIntentId: null,
    };

    await tx.subscriptionRequest.updateMany({
      where: { status: "pending" },
      data: { status: "canceled" },
    });

    const result = await tx.subscriptionRequest.create({
      data: subscriptionReqData,
    });
    return { requestId: result.id };
  });
};

const createStripeIntentIntoDB = async (
  requestId: string,
  user: TJWTPayload
) => {
  return prisma.$transaction(async (tx) => {
    const request = await tx.subscriptionRequest.findUnique({
      where: { id: requestId, userId: user.userId, status: "pending" },
    });

    if (!request) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid request");

    let paymentIntent;
    if (request.remainingPayableAmount) {
      paymentIntent = await Stripe.paymentIntents.create({
        amount: Math.round(request.remainingPayableAmount * 100),
        currency: "usd",
      });
    }
    if (paymentIntent?.id) {
      await tx.subscriptionRequest.update({
        where: {
          id: requestId,
        },
        data: {
          stripeIntentId: paymentIntent.id,
        },
      });
    }

    return { client_secret: paymentIntent?.client_secret };
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processChargeSucceeded = async (eventData: any) => {
  try {
    const {
      payment_method_details,
      balance_transaction,
      receipt_url,
      payment_intent,
    } = eventData.data.object;

    const subscriptionData: TCreateSubscription = {
      cardBrand: payment_method_details?.card?.brand || undefined,
      cardLast4: payment_method_details?.card?.last4 || undefined,
      transactionId: String(balance_transaction),
      receiptUrl: receipt_url || undefined,
      paymentProvider: "stripe",
      paymentIntent: String(payment_intent),
    };
    return prisma.$transaction(async (tx) => {
      await SubscriptionHelper.createSubscription(subscriptionData, tx);
    });
  } catch (error) {
    Logger.console.error("Payment successful, but failed to subscribe.", error);
  }
};

export const SubscriptionService = {
  createStripeIntentIntoDB,
  calculateSubscriptionAmount,
  createSubscriptionRequestIntoDB,
  processChargeSucceeded,
};
