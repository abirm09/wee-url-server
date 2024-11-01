import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { v4 as uuid } from "uuid";
import { prisma } from "../../../app";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import getDateCustomDaysFromNow from "../../../shared/getDateCustomDaysFromNow";
// import sendMailWithNodeMailer from "../../../shared/sendMailWithNodeMailer";
import setCookie from "../../../shared/setCookie";
import { TJWTPayload } from "../../../types/jwt/payload";
import TUserAgent from "../../../types/userAgent";
import isValidUser from "../../helper/isValidUser";
// import { AuthHelper } from "./auth.helper";

/**
 * The login function validates user credentials, generates access and refresh tokens, and logs in the
 * user's device information.
 * @param {User} payload - The `payload` parameter in the `login` function represents the user data
 * that is being passed to the function for authentication. It typically includes the user's email and
 * password.
 * @param {TUserAgent} [userAgent] - The `userAgent` parameter in the `login` function is used to pass
 * information about the user's device and browser. It is an optional parameter of type `TUserAgent`.
 * This parameter can contain details such as the operating system, browser, device type, etc., of the
 * user who is
 * @param {string} [userIp] - The `userIp` parameter in the `login` function represents the IP address
 * of the user who is attempting to log in. This parameter is optional and can be used to track the IP
 * address of the user for security or logging purposes. It allows you to capture the IP address from
 * which the login
 * @returns The `login` function is returning an object containing `accessToken` and `refreshToken`.
 */
const login = async (
  payload: User,
  userAgent?: TUserAgent,
  userIp?: string
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await isValidUser(
      tx,
      { email: payload.email },
      {
        email: true,
        password: true,
        id: true,
        userId: true,
        role: true,
      }
    );

    const isPasswordMatch = await bcrypt.compare(
      payload.password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Password didn't match");
    }

    const tokenId = uuid();

    const tokenPayload: TJWTPayload = {
      userId: user.id,
      role: user.role,
      tokenId,
    };

    const refreshToken = jwt.sign(tokenPayload, config.refresh_token.secret, {
      expiresIn: config.refresh_token.expires_in,
    });

    const accessToken = jwt.sign(tokenPayload, config.access_token.secret, {
      expiresIn: config.access_token.expires_in,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggedInDeviceData: any = {
      tokenId,
      userId: user.id,
      ip: userIp,
      os:
        `${userAgent?.os?.name ? userAgent?.os?.name + " " : ""}${userAgent?.os?.version || ""}` ||
        null,
      platform: userAgent?.device?.type,
      browser: userAgent?.browser?.name,
      city: null,
      country: null,
      expiresAt: getDateCustomDaysFromNow(config.refresh_token.expires_in),
    };

    await tx.loggedInDevice.create({ data: loggedInDeviceData });

    return { accessToken, refreshToken };
  });
};

/**
 * The function `accessToken` verifies a refresh token, extracts the payload, checks device
 * information, and generates a new access token while handling errors by clearing the refresh token
 * cookie.
 * @param {string} refreshToken - The `refreshToken` parameter is a string that represents the refresh
 * token used to generate a new access token. It is passed to the `accessToken` function to verify the
 * refresh token and extract the necessary information from it.
 * @param {Response} res - The `res` parameter in the `accessToken` function is typically used to
 * represent the response object in a web server environment. It allows you to send back the response
 * to the client making the request. In this context, it seems like the `res` parameter is being used
 * to handle setting a cookie
 * @returns A new access token is being returned after verifying the refresh token, extracting the
 * payload, checking device information, and generating a new access token.
 */
const accessToken = async (refreshToken: string, res: Response) => {
  try {
    // Verify the refresh token and extract the payload
    const { tokenId, userId, role } = jwt.verify(
      refreshToken,
      config.refresh_token.secret
    ) as TJWTPayload;

    return prisma.$transaction(async (tx) => {
      // Check if the device information exists for the given tokenId
      const deviceInfo = await tx.loggedInDevice.findUnique({
        where: { tokenId },
        select: {
          id: true,
          isBlocked: true,
        },
      });

      if (!deviceInfo) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");

      if (deviceInfo.isBlocked)
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");

      await tx.loggedInDevice.update({
        where: { id: deviceInfo.id },
        data: {
          lastUsedAt: new Date(),
        },
      });

      // Generate a new access token
      return jwt.sign({ userId, role, tokenId }, config.access_token.secret, {
        expiresIn: config.access_token.expires_in,
      });
    });
  } catch (error) {
    // Clear the refresh token cookie upon error
    setCookie(res, {
      cookieName: "we_url_t",
      value: refreshToken,
      cookieOption: { maxAge: 0 },
    });
    throw error;
  }
};

/**
 * The function `createVerifyEmailRequestIntoDB` handles the creation of email verification requests in
 * a database, including checking for recent requests and generating OTPs.
 * @param {TJWTPayload} payload - The `createVerifyEmailRequestIntoDB` function takes in a `payload`
 * parameter of type `TJWTPayload`. This payload likely contains information needed to verify a user's
 * email address, such as the user's ID.
 * @returns The `createVerifyEmailRequestIntoDB` function is returning the result of the transaction
 * operation performed using Prisma. This operation involves fetching user data based on the provided
 * payload, checking and handling email verification OTPs, updating the validity of existing OTPs,
 * generating a new OTP, and creating a new email verification OTP record in the database. The function
 * does not explicitly return a value, but it implicitly
 */
const createVerifyEmailRequestIntoDB = async (payload: TJWTPayload) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: payload.userId },
      select: {
        email: true,
        fullName: true,
        isEmailVerified: true,
        emailVerificationOTPs: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user?.email)
      throw new ApiError(httpStatus.BAD_REQUEST, "No user found.");

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000); // Subtract 15 minutes from the current time

    const findLessThan15MinOTPs = user?.emailVerificationOTPs?.filter(
      (item) => new Date(item.createdAt) > fifteenMinutesAgo // Check if the OTP was created within the last 15 minutes
    );

    if (Number(findLessThan15MinOTPs?.length || 0) > 3)
      throw new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        "To many email requests"
      );

    await tx.emailVerificationOTP.updateMany({
      where: {
        id: { in: user?.emailVerificationOTPs?.map((item) => item.id) },
      },
      data: {
        isValid: false,
      },
    });

    if (user.isEmailVerified)
      throw new ApiError(httpStatus.BAD_REQUEST, "Email is already verified.");

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // await sendMailWithNodeMailer({
    //   to: [user?.email],
    //   subject: "Verify Your Email for WeeURL Account",
    //   html: AuthHelper.OTPEmailTemplate({ userName: user.fullName, otp }),
    // });

    await tx.emailVerificationOTP.create({
      data: { otp, userId: payload.userId },
    });
  });
};

const verifyOtpFromDB = async (otp: string, user: TJWTPayload) => {
  return prisma.$transaction(async (tx) => {
    const userData = await tx.user.findUnique({
      where: { id: user.userId },
      select: {
        emailVerificationOTPs: {
          select: {
            id: true,
            isValid: true,
            otp: true,
            createdAt: true,
          },
        },
      },
    });

    const findOtpData = userData?.emailVerificationOTPs?.find(
      (item) => item.otp === otp
    );

    // Check if OTP is found
    if (!findOtpData) {
      throw new ApiError(httpStatus.BAD_REQUEST, "OTP did not match");
    }

    // Check if OTP is invalid
    if (!findOtpData.isValid) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
    }

    // Check if OTP creation time is within the last 10 minutes
    const otpCreationTime = new Date(findOtpData.createdAt);
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    if (otpCreationTime < tenMinutesAgo) {
      throw new ApiError(httpStatus.BAD_REQUEST, "OTP has expired");
    }

    await tx.emailVerificationOTP.deleteMany({
      where: { userId: user.userId },
    });

    await tx.user.update({
      where: { id: user.userId },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
  });
};

export const AuthService = {
  login,
  accessToken,
  createVerifyEmailRequestIntoDB,
  verifyOtpFromDB,
};
