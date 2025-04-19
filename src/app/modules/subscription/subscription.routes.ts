import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionValidation } from "./subscription.validations";

const route = Router();

/**
 * @swagger
 * /api/v1/subscription/calculate-subscription-amount:
 *   post:
 *     summary: Calculate subscription amount
 *     description: Calculate subscription plan and return subscription amount
 *     tags:
 *       - Subscription
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Access token on authorization header
 *         example: Bearer jwt.token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: string
 *                 example: 588bfc26-8d1e-4bb8-9ad8-d35881744dbb
 *               billingPeriodId:
 *                 type: string
 *                 example: 4280a172-aa88-4c35-9972-1440f7d90dae
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Log in successful
 *                 data:
 *                   type: object
 *                   properties:
 *                      token:
 *                         type: string
 *                         example: token.example
 *       400:
 *         description: Same structure for every error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Same structure for every error
 *                 errorMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: ""
 *                       message:
 *                         type: string
 *                         example: Same structure for every error
 *                 stack:
 *                   type: string
 *                   example: Error same structure for every error match\n as path/to/file.ts
 */
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
