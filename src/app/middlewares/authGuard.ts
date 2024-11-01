import { UsersRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { prisma } from "../../app";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { TJWTPayload } from "../../types/jwt/payload";
import { RedisUtils } from "../../utilities/redis";

/**
 * The `authGuard` function is a middleware in TypeScript that performs various authentication and
 * authorization checks before allowing access to certain routes.
 * @param  - The `authGuard` function is a middleware function used for authentication and
 * authorization in an Express application. It takes in an object as its parameter with the following
 * optional properties:
 */

const authGuard =
  ({
    requiredRoles,
    validateMaxDeviceLimit = true,
    validateIsEmailVerified = true,
  }: {
    requiredRoles?: UsersRole[];
    validateMaxDeviceLimit?: boolean;
    validateIsEmailVerified?: boolean;
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

      let payload;
      try {
        payload = jwt.verify(token, config.access_token.secret) as TJWTPayload;
      } catch (err) {
        const error = err as Error;
        if (error.name === "TokenExpiredError") {
          throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication failed.");
        }
        throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication failed.");
      }

      let user = await RedisUtils.getUserCache(payload.userId);

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
              select: {
                isBlocked: true,
              },
            },
          },
        });

        if (user)
          await RedisUtils.setUserCache(payload.userId, {
            ...user,
            loggedInDevices: undefined,
          });
      }

      // If no user exists
      if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "No user found.");

      // Check if the user has been banned
      if (user.status === "banned")
        throw new ApiError(httpStatus.FORBIDDEN, "You have been banned!");

      // Retrieve device from cache
      let device = await RedisUtils.getDeviceCache(payload.tokenId);

      if (!device) {
        const loggedInDevice = (user?.loggedInDevices || [])[0];
        device = loggedInDevice
          ? { isBlocked: loggedInDevice.isBlocked }
          : null;
        if (device) await RedisUtils.setDeviceCache(payload.tokenId, device);
      }

      if (!device || device.isBlocked === true)
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

      // Validate user requirements as before
      if (validateIsEmailVerified && user.isEmailVerified === false)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Please verify your email address"
        );
      if (user.needsPasswordChange)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Please change your password"
        );

      // Check if user reached max login device limit
      if (validateMaxDeviceLimit && user?.loggedInDevices?.length > 4)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Too many devices logged in."
        );

      // Check roles and permissions
      if (user.role !== "superAdmin") {
        if (requiredRoles?.length) {
          if (!requiredRoles.includes(user?.role)) {
            throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
          }
        }
      }

      req.user = payload;

      next();
    } catch (error) {
      next(error);
    }
  };

export default authGuard;
