import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import setCookie from "../../../shared/setCookie";
import successResponse from "../../../shared/successResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const userAgent = req.headers["user-agent"];
  const { accessToken, refreshToken } = await AuthService.login(
    body,
    userAgent,
    req.userIp
  );

  setCookie(res, {
    cookieName: "_wee_url",
    value: refreshToken,
    cookieOption: { maxAge: Number(config.refresh_token.cookie_expires_in) },
  });

  successResponse(res, {
    statusCode: httpStatus.OK,
    message: "Log in successful",
    data: { token: accessToken },
  });
});

const accessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies["_wee_url"];

  const token = await AuthService.accessToken(refreshToken, res);

  successResponse(res, {
    statusCode: httpStatus.OK,
    message: "Access token retrieved successfully",
    data: { token },
  });
});

const createVerifyEmailRequest = catchAsync(
  async (req: Request, res: Response) => {
    await AuthService.createVerifyEmailRequestIntoDB(req.user);

    successResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Email verification email sended successfully",
    });
  }
);

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  await AuthService.verifyOtpFromDB(req.body.otp, req.user);

  successResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Email verification successful",
  });
});

export const AuthController = {
  login,
  accessToken,
  createVerifyEmailRequest,
  verifyOtp,
};
