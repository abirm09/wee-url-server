import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { v4 as uuid } from "uuid";
import { prisma } from "../../../app";
import { env } from "../../../config";
import { ApiError } from "../../../errorHandlers";
import {
  getDateCustomDaysFromNow,
  sendMailWithNodeMailer,
  setCookie,
} from "../../../shared";
import { TJWTPayload } from "../../../types";
import { CacheManager, IPInfo } from "../../../utilities";
import isValidUser from "../../helper/isValidUser";
import { LoggedInDeviceInput } from "../logged_in_device/loggedInDevice.types";
import { UserService } from "../user_management/user/user.service";
import { AuthHelper } from "./auth.helper";

/**
 * The login function handles user authentication by verifying credentials, generating access and
 * refresh tokens, and storing device information upon successful login.
 * @param {User} payload - The `payload` parameter in the `login` function represents the user
 * credentials that are used for authentication. It typically includes the user's email and password.
 * @param {string} [userAgent] - The `userAgent` parameter in the `login` function is used to pass the
 * user agent string of the client's browser or device. This information can be helpful for tracking
 * and identifying the type of device or browser used for the login request. It is an optional
 * parameter, meaning it is not required
 * @param {string} [userIp] - The `userIp` parameter in the `login` function represents the IP address
 * of the user who is attempting to log in. It is used to track the location and other information
 * related to the user's device for security and logging purposes. The IP address can help identify the
 * geographical location of the user
 * @returns The `login` function is returning an object containing `accessToken` and `refreshToken`.
 */
const login = async (payload: User, userAgent?: string, userIp?: string) => {
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

    const refreshToken = jwt.sign(tokenPayload, env.refresh_token.secret, {
      expiresIn: env.refresh_token.expires_in,
    });

    const accessToken = jwt.sign(tokenPayload, env.access_token.secret, {
      expiresIn: env.access_token.expires_in,
    });

    const ipInFo = await IPInfo(userIp);

    const loggedInDeviceData: LoggedInDeviceInput = {
      tokenId,
      userId: user.id,
      ip: userIp || null,
      userAgent: userAgent || null,
      city: ipInFo?.city || null,
      country: ipInFo?.country || null,
      expiresAt: getDateCustomDaysFromNow(env.refresh_token.expires_in),
      isBlocked: false,
      lastUsedAt: new Date(),
      blockedAt: null,
    };

    await tx.loggedInDevice.create({ data: loggedInDeviceData });

    const profile = await UserService.profileFromDB(user.id);

    return { accessToken, refreshToken, profile };
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
  // Verify the refresh token and extract the payload
  const { tokenId, userId, role } = jwt.verify(
    refreshToken,
    env.refresh_token.secret
  ) as TJWTPayload;
  const invalidateCookieAndThrow = async (message: string) => {
    await CacheManager.deleteDeviceCache(tokenId);
    setCookie(res, {
      cookieName: env.cookieNames.accessToken,
      value: "",
      cookieOption: { maxAge: 0 },
    });
    throw new ApiError(httpStatus.FORBIDDEN, message);
  };
  return prisma.$transaction(async (tx) => {
    // Check if the device information exists for the given tokenId
    const deviceInfo = await tx.loggedInDevice.findUnique({
      where: { tokenId },
      select: {
        id: true,
        isBlocked: true,
      },
    });

    if (deviceInfo === null || deviceInfo.isBlocked === true) {
      return await invalidateCookieAndThrow("Forbidden");
    }

    await tx.loggedInDevice.update({
      where: { id: deviceInfo.id },
      data: {
        lastUsedAt: new Date(),
      },
    });

    // Generate a new access token
    await CacheManager.deleteUserCache(userId);
    return jwt.sign({ userId, role, tokenId }, env.access_token.secret, {
      expiresIn: env.access_token.expires_in,
    });
  });
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

    await sendMailWithNodeMailer({
      to: [user?.email],
      subject: "Verify Your Email for WeeURL Account",
      html: AuthHelper.OTPEmailTemplate({ userName: user.fullName, otp }),
    });

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
    await CacheManager.deleteUserCache(user.userId);
  });
};

const logout = async (user: TJWTPayload) => {
  await prisma.loggedInDevice.delete({
    where: {
      tokenId: user.tokenId,
    },
  });
  await CacheManager.deleteDeviceCache(user.tokenId);
};

export const AuthService = {
  login,
  accessToken,
  createVerifyEmailRequestIntoDB,
  verifyOtpFromDB,
  logout,
};
