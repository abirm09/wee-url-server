/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { TErrorMessages } from "../../types";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = "Not found";
  const errorMessages: TErrorMessages[] = [
    {
      path: req.originalUrl,
      message,
    },
  ];
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message,
    errorMessages,
  });
};
