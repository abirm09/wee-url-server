import { Router } from "express";
import { upload } from "../../../../config/multer";
import authGuard from "../../../middlewares/authGuard";
import rateLimit from "../../../middlewares/rateLimit";
import validateRequest from "../../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { UserMiddlewares } from "./user.middlewares";
import { UserValidations } from "./user.validations";

const route = Router();

route.post(
  "/",
  rateLimit(5),
  validateRequest(UserValidations.create),
  UserController.create
);

route.get(
  "/profile",
  rateLimit(5),
  authGuard({
    requiredRoles: ["admin", "customer"],
    validateIsEmailVerified: false,
    validateMaxDeviceLimit: false,
  }),
  UserController.profile
);

route.patch(
  "/",
  rateLimit(5),
  authGuard({
    requiredRoles: ["admin", "customer"],
  }),
  upload.userProfilePictures.single("image"),
  UserMiddlewares.convertUpdateProfileFormDataToObject,
  validateRequest(UserValidations.update),
  UserController.updateUser
);

export const UserRoutes = route;
