import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { prisma } from "../../../app";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import getDateCustomDaysFromNow from "../../../shared/getDateCustomDaysFromNow";
import setCookie from "../../../shared/setCookie";
import { TJWTPayload } from "../../../types/jwt/payload";
import TUserAgent from "../../../types/userAgent";
import isValidUser from "../../helper/isValidUser";

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

    const refreshToken = jwt.sign(tokenPayload, config.refresh_token_secret, {
      expiresIn: config.refresh_token_expires_in,
    });

    const accessToken = jwt.sign(tokenPayload, config.access_token_secret, {
      expiresIn: config.access_token_expires_in,
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
      expiresAt: getDateCustomDaysFromNow(config.refresh_token_expires_in),
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
      config.refresh_token_secret
    ) as TJWTPayload;

    return prisma.$transaction(async (tx) => {
      // Check if the device information exists for the given tokenId
      const deviceInfo = await tx.loggedInDevice.findUnique({
        where: { tokenId },
      });

      if (!deviceInfo) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }

      await tx.loggedInDevice.update({
        where: { id: deviceInfo.id },
        data: {
          lastUsedAt: new Date(),
        },
      });

      // Generate a new access token
      return jwt.sign({ userId, role, tokenId }, config.access_token_secret, {
        expiresIn: config.access_token_expires_in,
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

export const AuthService = {
  login,
  accessToken,
};
