import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../shared";
import { RedirectServices } from "./redirect.service";

const redirect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    return await RedirectServices.redirect(req, res, next);
  }
);

export const RedirectController = {
  redirect,
};
