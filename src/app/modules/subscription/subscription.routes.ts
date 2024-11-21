import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionValidation } from "./subscription.validations";

const route = Router();

route.post(
  "/calculate-subscription-amount",
  authGuard({ requiredRoles: ["customer"] }),
  validateRequest(SubscriptionValidation.calculateSubscriptionAmount),
  SubscriptionController.calculateSubscriptionAmount
);

route.post(
  "/create-subscription-request",
  authGuard({ requiredRoles: ["customer"] }),
  validateRequest(SubscriptionValidation.calculateSubscriptionAmount),
  SubscriptionController.createSubscriptionRequest
);

route.post(
  "/stripe-payment-intent",
  authGuard({ requiredRoles: ["customer"] }),
  validateRequest(SubscriptionValidation.createStripePaymentIntent),
  SubscriptionController.createStripeIntent
);

export const SubscriptionRoutes = route;
