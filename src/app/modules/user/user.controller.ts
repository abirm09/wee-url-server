import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import successResponse from "../../../shared/successResponse";
import { UserService } from "./user.service";

const create = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;

  await UserService.createIntoDB(body);

  successResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
  });
});

const profile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.profileFromDB(req.user.userId);

  successResponse(res, {
    statusCode: httpStatus.OK,
    message: "Profile data retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { user, profile } = req.body;

  const result = await UserService.updateUserIntoDB(user, profile, req.user);

  successResponse(res, {
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result,
  });
});

export const UserController = {
  create,
  profile,
  updateUser,
};
