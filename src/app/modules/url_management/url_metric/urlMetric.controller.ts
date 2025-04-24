import { Request, Response } from "express";
import httpStatus from "http-status";
import { PaginationConst } from "../../../../const";
import { catchAsync, Pick, successResponse } from "../../../../shared";
import { UrlMetricConst } from "./urlMetric.const";
import { UrlMetricService } from "./urlMetric.service";

const get = catchAsync(async (req: Request, res: Response) => {
  const options = Pick(req.query, PaginationConst.queryKeys);
  const filters = Pick(req.query, UrlMetricConst.urlMetricFilterableField);

  const { meta, data } = await UrlMetricService.getFromDB(
    req.user,
    req.params.id,
    options,
    filters
  );
  successResponse(res, {
    statusCode: httpStatus.OK,
    message: "Url metric retrieved successfully!",
    meta,
    data,
  });
});

const getUrlClicksCountCustomers = catchAsync(
  async (req: Request, res: Response) => {
    const filters = Pick(
      req.query,
      UrlMetricConst.urlClickCountFilterableField
    );
    const data = await UrlMetricService.getUrlClicksCountCustomersFromDB(
      req.user,
      req.params.id,
      filters
    );
    successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Url click count retrieved successfully!",
      data,
    });
  }
);

const getUrlClicksStat = catchAsync(async (req: Request, res: Response) => {
  const data = await UrlMetricService.getUrlClicksStatFromDB(
    req.user,
    req.params.id
  );
  successResponse(res, {
    statusCode: httpStatus.OK,
    message: "Url click stat retrieved successfully!",
    data,
  });
});

export const UrlMetricController = {
  get,
  getUrlClicksCountCustomers,
  getUrlClicksStat,
};
