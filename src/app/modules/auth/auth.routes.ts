import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import userAgent from "../../middlewares/userAgent";
import userIp from "../../middlewares/userIp";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidations } from "./auth.validations";

const route = Router();

route.post(
  "/login",
  validateRequest(AuthValidations.login),
  userAgent,
  userIp,
  AuthController.login
);

route.get(
  "/access-token",
  validateRequest(AuthValidations.accessToken),
  AuthController.accessToken
);

route.post(
  "/email-verify-request",
  authGuard({
    requiredRoles: ["superAdmin", "admin", "customer"],
    validateIsEmailVerified: false,
  }),
  validateRequest(AuthValidations.accessToken),
  AuthController.createVerifyEmailRequest
);

export const AuthRoutes = route;
