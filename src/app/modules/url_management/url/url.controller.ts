import { Request, Response } from "express";
import httpStatus from "http-status";
import { PaginationConst } from "../../../../const";
import { catchAsync, Pick, successResponse } from "../../../../shared";
import { UrlConst } from "./url.const";
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
  const options = Pick(req.query, PaginationConst.queryKeys);
  const filters = Pick(req.query, UrlConst.urlFilterableFields);

  const { data, meta } = await URLService.getAllUserFromDB(
    req.user,
    options,
    filters
  );

  successResponse(res, {
    statusCode: httpStatus.OK,
    message: "All url retrieved successfully.",
    meta,
    data,
  });
});

export const URLController = {
  create,
  getAllUser,
};
