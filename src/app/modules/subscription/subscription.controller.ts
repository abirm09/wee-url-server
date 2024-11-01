import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import successResponse from "../../../shared/successResponse";
import { SubscriptionService } from "./subscription.service";

const createSubscription = catchAsync(async (req: Request, res: Response) => {
  await SubscriptionService.createSubscriptionIntoDB();
  successResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Subscribed successfully",
  });
});

export const SubscriptionController = {
  createSubscription,
};
