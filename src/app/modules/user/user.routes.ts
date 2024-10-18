import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { UserValidations } from "./user.validations";

const route = Router();

route.post("/", validateRequest(UserValidations.create), UserController.create);

route.get(
  "/profile",
  authGuard({
    requiredRoles: ["admin", "customer"],
    validateIsEmailVerified: false,
    validateMaxDeviceLimit: false,
  }),
  UserController.profile
);

export const UserRoutes = route;
