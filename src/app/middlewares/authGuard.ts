import { UsersRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { prisma } from "../../app";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { TJWTPayload } from "../../types/jwt/payload";
import { RedisUtils } from "../../utilities/redis";

const authGuard =
  ({
    requiredRoles,
    validateMaxDeviceLimit = true,
    validateIsEmailVerified = true,
    validateIsNeedsPasswordChange = true,
  }: {
    requiredRoles?: UsersRole[];
    validateMaxDeviceLimit?: boolean;
    validateIsEmailVerified?: boolean;
    validateIsNeedsPasswordChange?: boolean;
  }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req?.headers?.authorization || "";
      if (!authHeader.startsWith("Bearer ")) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Invalid authorization format."
        );
      }
      const token = authHeader.split(" ")[1];

      let payload: TJWTPayload;
      try {
        payload = jwt.verify(token, config.access_token.secret) as TJWTPayload;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication failed.");
      }

      // Attempt to retrieve user and device from cache
      let [user, device] = await Promise.all([
        RedisUtils.getUserCache(payload.userId),
        RedisUtils.getDeviceCache(payload.tokenId),
      ]);

      // Retrieve from database if not cached
      if (!user) {
        user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            role: true,
            status: true,
            isEmailVerified: true,
            needsPasswordChange: true,
            email: true,
            loggedInDevices: {
              where: { tokenId: payload.tokenId },
              select: { isBlocked: true },
            },
          },
        });
        if (user)
          await RedisUtils.setUserCache(payload.userId, {
            ...user,
            loggedInDevices: undefined,
          });
      }

      // Check if user exists and validate status
      if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "No user found.");
      if (user.status === "banned")
        throw new ApiError(httpStatus.FORBIDDEN, "You have been banned!");

      // Retrieve device details if not cached
      if (!device && user.loggedInDevices.length) {
        device = { isBlocked: user.loggedInDevices[0].isBlocked };
        await RedisUtils.setDeviceCache(payload.tokenId, device);
      }
      if (!device) {
        const loggedInDevice = await prisma.loggedInDevice.findUnique({
          where: { tokenId: payload.tokenId },
          select: { isBlocked: true },
        });
        device = loggedInDevice
          ? { isBlocked: loggedInDevice.isBlocked }
          : null;
        if (device) await RedisUtils.setDeviceCache(payload.tokenId, device);
      }

      // Device validation
      if (!device || device.isBlocked) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }

      // Validate email verification and password change requirement
      if (validateIsEmailVerified && !user.isEmailVerified) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Please verify your email address"
        );
      }

      // CHeck if needs password change
      if (validateIsNeedsPasswordChange && user.needsPasswordChange) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Please change your password"
        );
      }

      // Validate max device limit
      if (validateMaxDeviceLimit && user.loggedInDevices.length > 4) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Too many devices logged in."
        );
      }

      // Check role permissions
      if (
        requiredRoles?.length &&
        user.role !== "superAdmin" &&
        !requiredRoles.includes(user.role)
      ) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }

      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  };

export default authGuard;
