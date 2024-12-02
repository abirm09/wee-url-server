import { Router } from "express";
import authGuard from "../../../middlewares/authGuard";
import validateRequest from "../../../middlewares/validateRequest";
import { URLController } from "./url.controller";
import { URLValidation } from "./url.validations";

const router = Router();

router.post(
  "/",
  authGuard({ requiredRoles: ["customer"] }),
  validateRequest(URLValidation.create),
  URLController.create
);

export const URLRoutes = router;
