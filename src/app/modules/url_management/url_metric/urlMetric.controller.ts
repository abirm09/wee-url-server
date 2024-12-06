import { Request, Response } from "express";
import httpStatus from "http-status";
import { PaginationConst } from "../../../../const";
import { catchAsync, Pick, successResponse } from "../../../../shared";
import { UrlMetricService } from "./urlMetric.service";

const get = catchAsync(async (req: Request, res: Response) => {
  const options = Pick(req.query, PaginationConst.queryKeys);
  const { meta, data } = await UrlMetricService.getFromDB(
    req.user,
    req.params.id,
    options
  );
  successResponse(res, {
    statusCode: httpStatus.OK,
    message: "Url metric retrieved successfully!",
    meta,
    data,
  });
});

export const UrlMetricController = {
  get,
};
