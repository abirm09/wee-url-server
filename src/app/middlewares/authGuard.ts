import { UsersRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { prisma } from "../../app";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { TJWTPayload } from "../../types/jwt/payload";

/**
 * The `authGuard` function is a middleware, that performs authentication, authorization,
 * and device limit validation for users based on their roles and login status.
 * @param  - The `authGuard` function is a middleware function that acts as a guard for protecting
 * routes by checking the authorization token, user roles, and other conditions before allowing access
 * to the route.
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
          "Invalid authorization format"
        );
      }
      const token = authHeader.split(" ")[1];

      let payload;
      try {
        payload = jwt.verify(token, config.access_token_secret) as TJWTPayload;
      } catch (err) {
        const error = err as Error;
        if (error.name === "TokenExpiredError") {
          throw new ApiError(httpStatus.UNAUTHORIZED, "Token expired");
        }
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          role: true,
          status: true,
          isEmailVerified: true,
          loggedInDevices: {
            select: {
              tokenId: true,
              isBlocked: true,
            },
          },
        },
      });

      // If no user exists
      if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "No user found");

      // Check if the user has been banned
      if (user.status === "banned")
        throw new ApiError(httpStatus.BAD_REQUEST, "You have been banned!");

      // Check token is blocked
      const findLoggedInDeviceData = user?.loggedInDevices?.find(
        (item) => item?.tokenId === payload?.tokenId
      );
      if (findLoggedInDeviceData?.isBlocked)
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorize request");

      // Check if user verified their email or not
      if (validateIsEmailVerified)
        if (user.isEmailVerified === false)
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Please verify your email"
          );

      // Check if user reached max login device limit
      if (validateMaxDeviceLimit)
        if (user?.loggedInDevices?.length > 4)
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Reached max login device limit. Please logout from another devices."
          );

      // Check roles
      if (requiredRoles?.length) {
        if (!requiredRoles.includes(user?.role)) {
          throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
        }
      }

      req.user = { ...payload, user };

      next();
    } catch (error) {
      next(error);
    }
  };

export default authGuard;
