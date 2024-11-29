import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync, successResponse } from "../../../shared";
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

export const URLController = {
  create,
};
