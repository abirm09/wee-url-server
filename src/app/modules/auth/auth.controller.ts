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

const accessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies["we_url_t"];

  const token = await AuthService.accessToken(refreshToken, res);

  successResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token retrieved successfully",
    data: { token },
  });
});

// const createVerifyEmailRequest = catchAsync(
//   async (req: Request, res: Response) => {
//     await AuthService.createVerifyEmailRequestIntoDB(req.user);

//     successResponse(res, {
//       statusCode: httpStatus.CREATED,
//       success: true,
//       message: "Email verification email sended successfully",
//     });
//   }
// );

export const AuthController = {
  login,
  accessToken,
  // createVerifyEmailRequest,
};
