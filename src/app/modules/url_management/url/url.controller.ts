import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync, successResponse } from "../../../../shared";
import { URLService } from "./url.service";

const create = catchAsync(async (req: Request, res: Response) => {
  const { url } = req.body;
  const result = await URLService.createIntoDB(url, req.user);
  successResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "New url created successfully.",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await URLService.getAllUserFromDB(req.user, req.query);
  successResponse(res, {
    statusCode: httpStatus.OK,
    message: "All url retrieved successfully.",
    data: result,
  });
});

export const URLController = {
  create,
  getAllUser,
};
