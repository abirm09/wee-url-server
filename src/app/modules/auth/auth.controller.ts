import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import setCookie from "../../../shared/setCookie";
import successResponse from "../../../shared/successResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;

  const { accessToken, refreshToken } = await AuthService.login(
    body,
    req.userAgent,
    req.userIp
  );

  setCookie(res, {
    cookieName: "we_url_t",
    value: refreshToken,
    cookieOption: { maxAge: Number(config.refresh_token_expires) },
  });

  successResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Log in successful",
    data: { token: accessToken },
  });
});

export const AuthController = {
  login,
};
