import { UsersRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { prisma } from "../../app";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { TJWTPayload } from "../../types/jwt/payload";

/**
 * The `authGuard` function is a middleware in TypeScript that performs various authentication checks
 * such as verifying tokens, checking user status, email verification, password change, device limits,
 * and required roles before allowing access to routes.
 * @param  - The `authGuard` function is a middleware function that acts as a guard for protecting
 * routes by checking various conditions related to user authentication and authorization. Here's an
 * explanation of the parameters it accepts:
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
        payload = jwt.verify(token, config.access_token.secret) as TJWTPayload;
      } catch (err) {
        const error = err as Error;
        if (error.name === "TokenExpiredError") {
          throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication failed");
        }
        throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication failed");
      }

      const user = await prisma.user.findUnique({
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
      // If no user exists
      if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "No user found");

      // Check if the user has been banned
      if (user.status === "banned")
        throw new ApiError(httpStatus.FORBIDDEN, "You have been banned!");

      // Check token is blocked no not found
      const findLoggedInDeviceData = user?.loggedInDevices![0];

      if (!findLoggedInDeviceData)
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

      if (findLoggedInDeviceData?.isBlocked)
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorize");

      // Check if user verified their email or not
      if (validateIsEmailVerified)
        if (user.isEmailVerified === false)
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Please verify your email address"
          );

      // Check if password change required
      if (user.needsPasswordChange)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Please change your password"
        );

      // Check if user reached max login device limit
      if (validateMaxDeviceLimit)
        if (user?.loggedInDevices?.length > 4)
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Too many devices logged in."
          );

      // Check roles
      if (user.role !== "superAdmin") {
        if (requiredRoles?.length) {
          if (!requiredRoles.includes(user?.role)) {
            throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
          }
        }
      }

      req.user = { ...payload, user };

      next();
    } catch (error) {
      next(error);
    }
  };

export default authGuard;
