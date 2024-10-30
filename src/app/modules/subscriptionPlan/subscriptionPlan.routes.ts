import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { SubscriptionPlanController } from "./subscriptionPlan.controller";
import { SubscriptionPlanValidation } from "./subscriptionPlan.validations";

const router = Router();

router.post(
  "/",
  authGuard({ requiredRoles: ["superAdmin"] }),
  validateRequest(SubscriptionPlanValidation.create),
  SubscriptionPlanController.create
);

export const SubscriptionPlanRoutes = router;
