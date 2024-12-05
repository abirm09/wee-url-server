import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync, successResponse } from "../../../shared";
import { SubscriptionService } from "./subscription.service";

const calculateSubscriptionAmount = catchAsync(
  async (req: Request, res: Response) => {
    const { planId, billingPeriodId, coupon } = req.body;
    const result = await SubscriptionService.calculateSubscriptionAmount(
      planId,
      billingPeriodId,
      coupon,
      req.user
    );
    successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Retrieved subscription amount successfully.",
      data: result,
    });
  }
);

const createSubscriptionRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { planId, billingPeriodId, coupon } = req.body;
    const result = await SubscriptionService.createSubscriptionRequestIntoDB(
      planId,
      billingPeriodId,
      coupon,
      req.user
    );
    successResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Subscription request created successfully.",
      data: result,
    });
  }
);

const createStripeIntent = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.body;
  const result = await SubscriptionService.createStripeIntentIntoDB(
    requestId,
    req.user
  );
  successResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Stripe payment intent created successfully.",
    data: result,
  });
});

export const SubscriptionController = {
  createStripeIntent,
  createSubscriptionRequest,
  calculateSubscriptionAmount,
};
