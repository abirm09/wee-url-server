import { UsersRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { prisma } from "../../app";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { TJWTPayload } from "../../types/jwt/payload";

/**
 * The `authGuard` function is a middleware in TypeScript that checks for user authentication, role
 * authorization, and user status before allowing access to protected routes.
 * @param  - The `authGuard` function is a middleware function that acts as an authentication guard for
 * routes in an Express application. It checks if the incoming request is authorized based on the
 * user's role and status.
 */
const authGuard =
  ({ requiredRoles }: { requiredRoles?: UsersRole[] }) =>
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
        select: { role: true, status: true },
      });

      if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "No user found");
      if (user.status === "banned")
        throw new ApiError(httpStatus.BAD_REQUEST, "You have been banned!");

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
