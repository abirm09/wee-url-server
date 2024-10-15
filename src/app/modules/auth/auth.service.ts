import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import getDateCustomDaysFromNow from "../../../shared/getDateCustomDaysFromNow";
import { TJWTPayload } from "../../../types/jwt/payload";
import TUserAgent from "../../../types/userAgent";
import isValidUser from "../../helper/isValidUser";
const prisma = new PrismaClient();

const login = async (
  payload: User,
  userAgent?: TUserAgent,
  userIp?: string
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await isValidUser(tx, payload.email, {
      email: true,
      password: true,
      id: true,
      userId: true,
      role: true,
    });

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

export const AuthService = {
  login,
};
