import { Router } from "express";
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

export const AuthRoutes = route;
