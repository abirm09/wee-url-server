import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import successResponse from "../../../shared/successResponse";
import { SubscriptionPlanService } from "./subscriptionPlan.service";

const create = catchAsync(async (req: Request, res: Response) => {
  const { subscriptionData, billingData } = req.body;
  const result = await SubscriptionPlanService.createIntoDB(
    subscriptionData,
    billingData
  );
  successResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Subscription plan created successful",
    data: result,
  });
});

const getAllPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionPlanService.getAllFromDB();
  successResponse(res, {
    statusCode: httpStatus.OK,
    message: "All subscription plan retrieved successful",
    data: result,
  });
});

export const SubscriptionPlanController = {
  create,
  getAllPlans,
};
