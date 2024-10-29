import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import rateLimit from "../../middlewares/rateLimit";
import userAgent from "../../middlewares/userAgent";
import userIp from "../../middlewares/userIp";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidations } from "./auth.validations";

const route = Router();

route.post(
  "/login",
  rateLimit(5),
  validateRequest(AuthValidations.login),
  userAgent,
  userIp,
  AuthController.login
);

route.get(
  "/access-token",
  rateLimit(5),
  validateRequest(AuthValidations.accessToken),
  AuthController.accessToken
);

route.post(
  "/email-verify-request",
  rateLimit(5),
  authGuard({
    requiredRoles: ["admin", "customer"],
    validateIsEmailVerified: false,
  }),
  AuthController.createVerifyEmailRequest
);

route.post(
  "/verify-otp",
  rateLimit(5),
  authGuard({
    requiredRoles: ["admin", "customer"],
    validateIsEmailVerified: false,
  }),
  AuthController.verifyOtp
);

export const AuthRoutes = route;
